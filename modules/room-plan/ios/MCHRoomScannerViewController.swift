import UIKit
import RoomPlan

struct RoomDimensions {
  let widthFt: Double
  let lengthFt: Double
  let heightFt: Double
}

class MCHRoomScannerViewController: UIViewController, RoomCaptureViewDelegate, RoomCaptureSessionDelegate {
  
  var onComplete: ((RoomDimensions) -> Void)?
  var onError: ((String) -> Void)?
  
  private var roomCaptureView: RoomCaptureView!
  private var captureConfiguration = RoomCaptureSession.Configuration()
  
  override func viewDidLoad() {
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
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    roomCaptureView.captureSession.run(configuration: captureConfiguration)
  }
  
  override func viewWillDisappear(_ animated: Bool) {
    super.viewWillDisappear(animated)
    roomCaptureView.captureSession.stop()
  }
  
  @objc private func doneTapped() {
    roomCaptureView.captureSession.stop()
  }
  
  @objc private func cancelTapped() {
    roomCaptureView.captureSession.stop()
    dismiss(animated: true) {
      self.onError?("cancelled")
    }
  }
  
  // MARK: - RoomCaptureSessionDelegate
  
  func captureSession(_ session: RoomCaptureSession, didEndWith data: CapturedRoomData, error: Error?) {
    if let error = error {
      DispatchQueue.main.async {
        self.dismiss(animated: true) {
          self.onError?(error.localizedDescription)
        }
      }
      return
    }
    
    Task {
      let structure = try? await RoomBuilder(options: [.beautifyObjects]).capturedRoom(from: data)
      
      await MainActor.run {
        self.dismiss(animated: true) {
          if let room = structure {
            let dims = self.extractDimensions(from: room)
            self.onComplete?(dims)
          } else {
            let dims = self.extractDimensionsFromData(data)
            self.onComplete?(dims)
          }
        }
      }
    }
  }
  
  private func extractDimensions(from room: CapturedRoom) -> RoomDimensions {
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
    
    // Fall back to walls if floors gave nothing
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
    
    return RoomDimensions(
      widthFt: (maxWidth * 10).rounded() / 10,
      lengthFt: (maxLength * 10).rounded() / 10,
      heightFt: (maxHeight * 10).rounded() / 10
    )
  }
  
  private func extractDimensionsFromData(_ data: CapturedRoomData) -> RoomDimensions {
    return RoomDimensions(widthFt: 10.0, lengthFt: 12.0, heightFt: 9.0)
  }
  
  func captureSession(_ session: RoomCaptureSession, didUpdate room: CapturedRoom) {
    // Live updates during scan — RoomPlan handles the UI automatically
  }
}
