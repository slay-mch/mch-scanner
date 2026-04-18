require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', '..', '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'RoomPlanModule'
  s.version        = package['version']
  s.summary        = 'MCH RoomPlan native module'
  s.description    = 'Expo native module wrapping Apple RoomPlan API for MCH Scanner'
  s.homepage       = 'https://github.com/slay-mch/mch-scanner'
  s.license        = package['license']
  s.authors        = package['author']
  s.platform       = :ios, '16.0'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = '*.swift'
  
  s.frameworks = 'RoomPlan'
end
