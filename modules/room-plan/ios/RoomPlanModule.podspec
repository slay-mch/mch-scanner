require 'json'

Pod::Spec.new do |s|
  s.name           = 'RoomPlanModule'
  s.version        = '1.0.0'
  s.summary        = 'MCH Room Scanner native module'
  s.description    = 'Wraps Apple RoomPlan API for MCH Scanner'
  s.homepage       = 'https://myclubhaus.co'
  s.license        = 'MIT'
  s.author         = 'MyClubHaus'
  s.platform       = :ios, '16.0'
  s.source         = { :path => '.' }
  s.source_files   = 'ios/*.swift'
  s.frameworks     = 'RoomPlan'
  s.dependency 'ExpoModulesCore'
end
