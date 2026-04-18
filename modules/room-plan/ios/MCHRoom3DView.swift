import UIKit
import SceneKit

@objc public class MCHRoom3DView: UIView {
  private var scnView: SCNView!

  @objc public var widthFt: CGFloat = 12 { didSet { buildScene() } }
  @objc public var lengthFt: CGFloat = 15 { didSet { buildScene() } }
  @objc public var heightFt: CGFloat = 9  { didSet { buildScene() } }

  public override init(frame: CGRect) {
    super.init(frame: frame)
    setupSCNView()
    buildScene()
  }
  required init?(coder: NSCoder) { fatalError() }

  private func setupSCNView() {
    scnView = SCNView(frame: bounds)
    scnView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    scnView.backgroundColor = UIColor(red: 0.06, green: 0.12, blue: 0.08, alpha: 1) // #0f1f14
    scnView.allowsCameraControl = true   // built-in orbit gesture
    scnView.autoenablesDefaultLighting = false
    scnView.antialiasingMode = .multisampling4X
    addSubview(scnView)
  }

  private func buildScene() {
    let scene = SCNScene()

    // Scale: 1 SceneKit unit = 1 ft
    let w = Float(widthFt)
    let l = Float(lengthFt)
    let h = Float(heightFt)

    // Floor
    let floor = SCNBox(width: CGFloat(w), height: 0.04, length: CGFloat(l), chamferRadius: 0)
    floor.firstMaterial?.diffuse.contents = UIColor(red: 0.12, green: 0.28, blue: 0.16, alpha: 0.6) // dim green
    floor.firstMaterial?.isDoubleSided = true
    let floorNode = SCNNode(geometry: floor)
    floorNode.position = SCNVector3(0, 0, 0)
    scene.rootNode.addChildNode(floorNode)

    // Walls — 4 thin boxes forming the perimeter
    let wallThickness: Float = 0.08
    let wallColor = UIColor(red: 0.29, green: 0.86, blue: 0.50, alpha: 0.25) // #4ade80 at 25% opacity
    let wallMaterial = SCNMaterial()
    wallMaterial.diffuse.contents = wallColor
    wallMaterial.isDoubleSided = true
    wallMaterial.transparency = 0.75

    func makeWall(width: Float, height: Float, depth: Float, pos: SCNVector3) -> SCNNode {
      let geo = SCNBox(width: CGFloat(width), height: CGFloat(height), length: CGFloat(depth), chamferRadius: 0)
      geo.firstMaterial = wallMaterial
      let node = SCNNode(geometry: geo)
      node.position = pos
      return node
    }

    // Front / back walls (along X axis)
    scene.rootNode.addChildNode(makeWall(width: w, height: h, depth: wallThickness, pos: SCNVector3(0, h/2, l/2)))
    scene.rootNode.addChildNode(makeWall(width: w, height: h, depth: wallThickness, pos: SCNVector3(0, h/2, -l/2)))
    // Left / right walls (along Z axis)
    scene.rootNode.addChildNode(makeWall(width: wallThickness, height: h, depth: l, pos: SCNVector3(-w/2, h/2, 0)))
    scene.rootNode.addChildNode(makeWall(width: wallThickness, height: h, depth: l, pos: SCNVector3(w/2, h/2, 0)))

    // Ceiling (wireframe only — use lines along edges)
    let ceilColor = UIColor(red: 0.29, green: 0.86, blue: 0.50, alpha: 0.15)
    let ceil = SCNBox(width: CGFloat(w), height: 0.04, length: CGFloat(l), chamferRadius: 0)
    ceil.firstMaterial?.diffuse.contents = ceilColor
    ceil.firstMaterial?.isDoubleSided = true
    let ceilNode = SCNNode(geometry: ceil)
    ceilNode.position = SCNVector3(0, h, 0)
    scene.rootNode.addChildNode(ceilNode)

    // Lighting
    let ambient = SCNLight()
    ambient.type = .ambient
    ambient.intensity = 800
    ambient.color = UIColor.white
    let ambientNode = SCNNode()
    ambientNode.light = ambient
    scene.rootNode.addChildNode(ambientNode)

    let directional = SCNLight()
    directional.type = .directional
    directional.intensity = 600
    directional.color = UIColor(red: 0.29, green: 0.86, blue: 0.50, alpha: 1)
    let dirNode = SCNNode()
    dirNode.light = directional
    dirNode.eulerAngles = SCNVector3(-Float.pi / 4, Float.pi / 4, 0)
    scene.rootNode.addChildNode(dirNode)

    // Camera — isometric-ish starting position
    let camera = SCNCamera()
    camera.fieldOfView = 55
    let cameraNode = SCNNode()
    cameraNode.camera = camera
    let dist = max(w, l) * 1.5
    cameraNode.position = SCNVector3(dist * 0.8, dist * 0.7, dist * 0.8)
    cameraNode.look(at: SCNVector3(0, h/2, 0))
    scene.rootNode.addChildNode(cameraNode)

    scnView.scene = scene
    scnView.pointOfView = cameraNode
  }
}
