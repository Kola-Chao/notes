# notes
Laya 打包Android  Laya.stage.on(Laya.Event.MOUSE_OUT) //在安卓端无效
Cocos3D 1.2.0 打包Web-mobile，在UC平台刷新之后，addChild（）会报错Array buffer allocation failed

Cocos打包：
1:233平台
  ABIs [arm64-v8a,armeabi-v7a,armeabi] set by 'android.injected.build.abi' gradle flag contained 'ARMEABI, ARM64_V8A' not targeted by this project.
  解决方案：  implementation 'androidx.appcompat:appcompat:1.2.0' 使用这个替代 implementation 'com.android.support:support-v4:28.0.0'

 java.lang.UnsatisfiedLinkError: dalvik.system.PathClassLoader[DexPathList[[zip file "/data/app/com.daoyuan.theworldofswords.mi-ksJo-mSSAS5jcDJsUWz8iA==/base.apk"],nativeLibraryDirectories=[/data/app/com.daoyuan.theworldofswords.mi-ksJo-mSSAS5jcDJsUWz8iA==/lib/arm64, /data/app/com.daoyuan.theworldofswords.mi-ksJo-mSSAS5jcDJsUWz8iA==/base.apk!/lib/arm64-v8a, /system/lib64, /system/product/lib64]]] couldn't find "libcocos2djs.so"
 解决方案： 在defaultConfig里指定平台：ndk { abiFilters  'armeabi-v7a'}
2:小米平台
  不仅要接SDK，还需要把配置资源给接入进去
  
  
Android 接入SDK：
1:友盟 https://developer.umeng.com/docs/119267/detail/118584
    maven { url 'https://dl.bintray.com/umsdk/release' }
   // 友盟统计SDK
    implementation  'com.umeng.umsdk:common:9.3.7'// 必选
    implementation  'com.umeng.umsdk:asms:1.2.1'// 必选

    修改AndroidManifest.xm
    
2:火山引擎 https://www.volcengine.com/docs/6297/65851

Q::java.lang.RuntimeException: Unable to get provider com.anythink.china.common.ApkFileProvider:
A::android.useAndroidX=true
# Automatically convert third-party libraries to use AndroidX
android.enableJetifier=true

api30以上，不支持自定义toast（toast.setView & toase.getView）
所有的handle.postdelay(new Runnable,delyTime)里的runnable里的操作的对象都可能会被回收，都要做处理
