import Foundation

@objc public protocol RoomPlanDelegate: AnyObject {
  func didCompleteWithWidth(_ widthFt: Double, length lengthFt: Double, height heightFt: Double, usdzPath: String?)
  func didFailWithError(_ message: String)
}
