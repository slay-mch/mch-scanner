Pod::Spec.new do |s|
  s.name           = 'MCHRoomPlan'
  s.version        = '1.0.0'
  s.summary        = 'MCH Room Scanner native module'
  s.description    = 'Expo module wrapping Apple RoomPlan for MCH Scanner app'
  s.author         = 'MCH'
  s.homepage       = 'https://myclubhaus.co'
  s.platforms      = { :ios => '17.0' }
  s.source         = { :git => '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files   = 'ios/**/*.{swift,h,m}'
  s.frameworks     = 'RoomPlan'
end
