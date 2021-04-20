# notes
Laya 打包Android  Laya.stage.on(Laya.Event.MOUSE_OUT) //在安卓端无效
Cocos3D 1.2.0 打包Web-mobile，在UC平台刷新之后，addChild（）会报错Array buffer allocation failed

Cocos打包：
1:233平台
  ABIs [arm64-v8a,armeabi-v7a,armeabi] set by 'android.injected.build.abi' gradle flag contained 'ARMEABI, ARM64_V8A' not targeted by this project.
  解决方案：  implementation 'androidx.appcompat:appcompat:1.2.0' 使用这个替代 implementation 'com.android.support:support-v4:28.0.0'
