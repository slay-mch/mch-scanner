import UIKit
import RoomPlan

@objc public class MCHRoomScannerViewController: UIViewController, RoomCaptureViewDelegate, RoomCaptureSessionDelegate {

  @objc public weak var delegate: RoomPlanDelegate?

  private var roomCaptureView: RoomCaptureView!
  private var captureConfiguration = RoomCaptureSession.Configuration()
  private var isSessionRunning = false

  public override func viewDidLoad() {
    super.viewDidLoad()
    view.backgroundColor = UIColor(red: 0.06, green: 0.12, blue: 0.08, alpha: 1.0)
    setupRoomCaptureView()
    setupDoneButton()
    setupCancelButton()
  }

  private func setupRoomCaptureView() {
    roomCaptureView = RoomCaptureView(frame: view.bounds)
    roomCaptureView.captureSession.delegate = self
    roomCaptureView.delegate = self
    roomCaptureView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    view.addSubview(roomCaptureView)
  }

  private func setupDoneButton() {
    let button = UIButton(type: .system)
    button.setTitle("Done Scanning", for: .normal)
    button.setTitleColor(UIColor(red: 0.06, green: 0.12, blue: 0.08, alpha: 1.0), for: .normal)
    button.backgroundColor = UIColor(red: 0.29, green: 0.87, blue: 0.50, alpha: 1.0)
    button.layer.cornerRadius = 12
    button.titleLabel?.font = UIFont.boldSystemFont(ofSize: 17)
    button.translatesAutoresizingMaskIntoConstraints = false
    button.addTarget(self, action: #selector(doneTapped), for: .touchUpInside)
    view.addSubview(button)

    NSLayoutConstraint.activate([
      button.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -16),
      button.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 24),
      button.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24),
      button.heightAnchor.constraint(equalToConstant: 52)
    ])
  }

  private func setupCancelButton() {
    let button = UIButton(type: .system)
    button.setTitle("Cancel", for: .normal)
    button.setTitleColor(UIColor(red: 0.61, green: 0.64, blue: 0.65, alpha: 1.0), for: .normal)
    button.translatesAutoresizingMaskIntoConstraints = false
    button.addTarget(self, action: #selector(cancelTapped), for: .touchUpInside)
    view.addSubview(button)

    NSLayoutConstraint.activate([
      button.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
      button.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -24)
    ])
  }

  // Session starts in viewDidAppear — more reliable than viewWillAppear for AR/camera
  public override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    roomCaptureView.captureSession.run(configuration: captureConfiguration)
  }

  public override func viewWillDisappear(_ animated: Bool) {
    super.viewWillDisappear(animated)
    if isSessionRunning {
      roomCaptureView.captureSession.stop()
    }
  }

  @objc private func doneTapped() {
    guard isSessionRunning else {
      // Session never started — dismiss gracefully
      dismiss(animated: true) {
        self.delegate?.didFailWithError("scan_not_started")
      }
      return
    }
    isSessionRunning = false
    roomCaptureView.captureSession.stop()
  }

  @objc private func cancelTapped() {
    isSessionRunning = false
    roomCaptureView.captureSession.stop()
    dismiss(animated: true) {
      self.delegate?.didFailWithError("cancelled")
    }
  }

  // MARK: - RoomCaptureSessionDelegate

  public func captureSession(_ session: RoomCaptureSession, didStartWith configuration: RoomCaptureSession.Configuration) {
    DispatchQueue.main.async {
      self.isSessionRunning = true
    }
  }

  public func captureSession(_ session: RoomCaptureSession, didEndWith data: CapturedRoomData, error: Error?) {
    isSessionRunning = false

    if let error = error {
      DispatchQueue.main.async {
        self.dismiss(animated: true) {
          self.delegate?.didFailWithError(error.localizedDescription)
        }
      }
      return
    }

    Task {
      do {
        let room = try await RoomBuilder(options: [.beautifyObjects]).capturedRoom(from: data)
        let (widthFt, lengthFt, heightFt) = self.extractDimensions(from: room)

        // Export .usdz to temp directory
        let tempURL = FileManager.default.temporaryDirectory
          .appendingPathComponent(UUID().uuidString)
          .appendingPathExtension("usdz")
        do {
          try await room.export(to: tempURL)
          await MainActor.run {
            self.dismiss(animated: true) {
              self.delegate?.didCompleteWithWidth(widthFt, length: lengthFt, height: heightFt, usdzPath: tempURL.path)
            }
          }
        } catch {
          // Export failed — still send dimensions without usdz
          await MainActor.run {
            self.dismiss(animated: true) {
              self.delegate?.didCompleteWithWidth(widthFt, length: lengthFt, height: heightFt, usdzPath: nil)
            }
          }
        }
      } catch {
        // RoomBuilder failed — use fallback dimensions
        await MainActor.run {
          self.dismiss(animated: true) {
            self.delegate?.didCompleteWithWidth(10.0, length: 12.0, height: 9.0, usdzPath: nil)
          }
        }
      }
    }
  }

  private func extractDimensions(from room: CapturedRoom) -> (Double, Double, Double) {
    let metersToFeet = 3.28084

    var maxWidth: Double = 0
    var maxLength: Double = 0

    if #available(iOS 17.0, *) {
      for floor in room.floors {
        let w = Double(floor.dimensions.x) * metersToFeet
        let l = Double(floor.dimensions.y) * metersToFeet
        maxWidth = max(maxWidth, w)
        maxLength = max(maxLength, l)
      }
    }

    if maxWidth < 1 {
      for wall in room.walls {
        let w = Double(wall.dimensions.x) * metersToFeet
        maxWidth = max(maxWidth, w)
      }
    }
    if maxLength < 1 {
      for wall in room.walls {
        let l = Double(wall.dimensions.x) * metersToFeet
        maxLength = max(maxLength, l)
      }
    }

    var maxHeight: Double = 0
    for wall in room.walls {
      let h = Double(wall.dimensions.y) * metersToFeet
      maxHeight = max(maxHeight, h)
    }

    if maxWidth < 1 { maxWidth = 10 }
    if maxLength < 1 { maxLength = 12 }
    if maxHeight < 1 { maxHeight = 9 }

    return (
      (maxWidth * 10).rounded() / 10,
      (maxLength * 10).rounded() / 10,
      (maxHeight * 10).rounded() / 10
    )
  }

  public func captureSession(_ session: RoomCaptureSession, didUpdate room: CapturedRoom) {
    // Live updates during scan — RoomPlan handles UI automatically
  }
}
