Pod::Spec.new do |s|
  s.name         = 'RoomPlanNative'
  s.version      = '1.0.0'
  s.summary      = 'RoomPlan native bridge for MCH Scanner'
  s.homepage     = 'https://myclubhaus.co'
  s.license      = 'MIT'
  s.author       = { 'MCH' => 'slay@myclubhaus.co' }
  s.platform     = :ios, '17.0'
  s.source       = { :path => '.' }
  s.source_files = 'ios/**/*.{swift,m,h}'
  s.frameworks   = 'RoomPlan'
  s.dependency 'React-Core'
  s.pod_target_xcconfig = {
    'SWIFT_VERSION' => '5.0'
  }
end
