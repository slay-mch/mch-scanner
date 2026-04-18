import ExpoModulesCore
import RoomPlan
import UIKit

public class RoomPlanModule: Module {
  public func definition() -> ModuleDefinition {
    Name("RoomPlanModule")
    
    Events("onScanComplete", "onScanError")
    
    Function("startScan") {
      DispatchQueue.main.async {
        self.presentScanner()
      }
    }
  }
  
  private func presentScanner() {
    guard let rootVC = UIApplication.shared.connectedScenes
      .compactMap({ $0 as? UIWindowScene })
      .first?.windows
      .first?.rootViewController else {
      self.sendEvent("onScanError", ["message": "Could not find root view controller"])
      return
    }
    
    let scannerVC = MCHRoomScannerViewController()
    scannerVC.onComplete = { [weak self] dimensions in
      self?.sendEvent("onScanComplete", [
        "widthFt": dimensions.widthFt,
        "lengthFt": dimensions.lengthFt,
        "heightFt": dimensions.heightFt
      ])
    }
    scannerVC.onError = { [weak self] message in
      self?.sendEvent("onScanError", ["message": message])
    }
    scannerVC.modalPresentationStyle = .fullScreen
    rootVC.present(scannerVC, animated: true)
  }
}
