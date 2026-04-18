require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'mch-room-plan'
  s.version        = package['version'] || '1.0.0'
  s.summary        = 'MCH RoomPlan native module for room scanning'
  s.description    = 'Custom Expo module wrapping Apple RoomPlan LiDAR scanning API'
  s.homepage       = 'https://github.com/slay-mch/mch-scanner'
  s.license        = 'MIT'
  s.author         = { 'MCH' => 'slay@myclubhaus.co' }
  s.platform       = :ios, '16.0'
  s.source         = { :path => '.' }
  s.source_files   = 'ios/**/*.swift'
  s.frameworks     = 'RoomPlan', 'ARKit', 'SceneKit'
  s.weak_frameworks = 'RoomPlan'
  
  s.dependency 'ExpoModulesCore'
end
