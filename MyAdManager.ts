/**
 * 目前只支持一个广告位配置一个ID，需要多ID的可以自己扩展
 * 只是各个平台最基础的广告请求封装，自定义的需求可以自己扩展
 * 广告控制类，使用方法如下：
 *      在正式环境打包的时候需要先设置： myAdManager.getInstance().setDebugMode = false;
 *      修改 getCurPlatform 方法里的返回值为对应平台的关键字（eg: wx\qq\tt\qg\swan...） 
 *      配置 ========= 
 *            .... 
 *          ========= 里包围的广告参数
 *      根据平台和具体广告请求的区别分别依次修改各个showXXAd里checkVersionWithXX()所需要的具体参数（如果可以此步骤可以直接通过return -1 不做判断）
 *      最后展示广告：myAdManager.getInstance().showBannerAd()... 
 */

/**
 * Todo list:
 *      广告位多ID
 */
export class MyAdManager {
    private TAG: string = "Kola";
    private static adManager: MyAdManager;
    private isDebug: boolean = true;
    private isRewardLoaded: boolean = false;
    private bannerAd = null;
    private rewardedAd = null;
    private interstitialAd = null;
    private customAd = null; // 微信平台的customAd
    private nativeAd = null; // Oppo的nativeAd 
    private TIME_INTERVAL: number = 3000; //默认的请求间隔ms
    private timeTmp: number = 0;
    // ================================
    //      广告平台对应的参数配置
    private bannerID: string = '4e8e64d0fd9f490aa4188fb8955ea38e';   //banner广告ID
    private rewardedID: string = 'adunit-e03bbccb16a7a923';    //激励视频广告ID
    private interstitialID: string = 'b725d1acac734f3e801a02f219af6e54';    //插屏广告ID
    private customID = 'adunit-9d1ca0857fa10491';    //微信custom广告的ID
    private nativeID = 'ce5295edac28444c83c7aba729c6fa0c';    //快应用native广告的ID
    //      广告平台对应的参数配置 end
    // ================================

    public static getInstance(): MyAdManager {
        if (this.adManager == null) {
            this.adManager = new MyAdManager();
        }
        return this.adManager;
    }

    /**
     * 正式版需要设置debug模式为false
     */
    public set setDebugMode(v: boolean) {
        this.isDebug = v;
        // 初始化的时候先缓存一次激励视频
        // if (!v) {
        //     this.showRewardedAd();
        // }
    }

    private get getCurPlatform() {
        if (this.isDebug) return;
        return wx;
    }

    showBannerAd() {
        if (this.isDebug) return;
        // =======需要随平台扩展========
        if (this.checkVersionWithDot("2.0.4") > 0) return;
        if (this.bannerAd == null) {
            this.bannerAd = this.getCurPlatform.createBannerAd({
                adUnitId: this.bannerID,
                style: {
                    left: 0,
                    top: 0,
                }
            })

            this.bannerAd.onError((err) => {
                console.log(this.TAG, "Banner Ad error :", JSON.stringify(err));
            })

            this.bannerAd.onResize((res) => {
                this.bannerAd.style.top;
            })
        }

        this.bannerAd.show().then(() => { }).catch((err) => {
            console.log(this.TAG, "Banner Ad show error", JSON.stringify(err));
        });
    }

    showRewardedAd(caller: any, callback: (resoult: boolean) => void, rewardVideoID?: string,) {
        if (this.isDebug) return;
        // =======需要随平台扩展========
        if (this.checkVersionWithDot("2.0.4") > 0) return;
        if (!this.canRequestByTimeInterval()) return;
        if (this.rewardedAd == null) {
            console.log(this.TAG, "init rewardedAd");
            this.rewardedAd = this.getCurPlatform.createRewardedVideoAd({
                adUnitId: this.rewardedID,
            })

            this.rewardedAd.onError(err => {
                console.log(this.TAG, "激励视频加载失败", JSON.stringify(err));
                // 这里可能会在load,show error的时候回调，所以这里不做cb防止多次cb
                // callback.call(caller, false);
            })

            this.rewardedAd.onLoad(() => {
                this.isRewardLoaded = true;
            })
        }
        console.log(this.TAG, "init rewardedAd closelistener");

        let videoCloseListener = res => {
            this.isRewardLoaded = false;
            if (res.isEnded) {
                callback.call(caller, true);
            } else {
                callback.call(caller, false);
            }
            this.rewardedAd.offClose(videoCloseListener);
            this.rewardedAd.load();
        }
        if (caller && callback) {
            this.rewardedAd.onClose(videoCloseListener);
        }

        if (this.isRewardLoaded) {
            console.log(this.TAG, "激励视频已缓存，直接展示")
            this.rewardedAd.show();
        } else {
            console.log(this.TAG, "激励视频未缓存，加载并展示")
            this.rewardedAd.load().then(() => {
                // 如果使用了在 setDebugMode 里缓存一次激励视频的逻辑。这里就不可以直接 show 了
                this.rewardedAd.show();
            })
        }

    }

    showInterstitialAd() {
        if (this.isDebug) return;
        // =======需要随平台扩展========
        if (this.checkVersionWithDot("2.6.0") > 0) return;
        if (this.interstitialAd == null) {
            this.interstitialAd = this.getCurPlatform.createInterstitialAd({
                adUnitId: this.interstitialID,
            })

            this.interstitialAd.onError((err) => {
                console.log(this.TAG, "interstitial Ad error :", JSON.stringify(err));
            })
        }
        this.interstitialAd.show().catch((err) => {
            console.log(this.TAG, "interstitialAd show error :", JSON.stringify(err))
        })
    }

    showCustomAd() {
        if (this.isDebug) return;
        // =======需要随平台扩展========
        if (this.checkVersionWithDot("2.11.1") > 0) return;
        if (this.customAd == null) {
            this.customAd = this.getCurPlatform.createCustomAd({
                adUnitId: this.customID,
                adIntervals: 30,
                style: {
                    left: 0,
                    top: 0,
                }
            })
        }
        this.customAd.show();
    }

    /**
     * 手机厂商的快应用支持的原生广告
     * 这里会回调原生广告对象给caller，然后自己请求渲染
     * @returns null
     */
    /**
     *  AdManager.getInstance().loadNativeAD(AdManager.nativeBannerID, this, (success, res) => {
            console.debug("回调返回值success :" + success + "\t" + res)
            if (success) {
                this.response_banner = res;
                if (res.imgUrlList[0]) {
                    loader.load(res.imgUrlList[0], (err, imageAsset) => {
                        // Use texture to create sprite frame
                        if (err == null) {
                            const fram = new SpriteFrame();
                            fram.texture = imageAsset._texture;
                            this.bannerAdBg.spriteFrame = fram;
                            this.nativeBannerAd.active = true;
                        }
                    });
                } else if (res.icon) {
                    console.log("Kola 没有广告参数。加载ICON");
                    loader.load(res.icon, (err, imageAsset) => {
                        // Use texture to create sprite frame
                        if (err == null) {
                            console.log("Kola刷新")
                            const fram = new SpriteFrame();
                            fram.texture = imageAsset._texture;
                            this.bannerAdBg.spriteFrame = fram;
                            this.nativeBannerAd.active = true;
                        }
                    });
                }
            }
        });
     */
    showNativeAd(caller: any, callback: (success: boolean, res: any) => void, nativeID?: string) {
        if (this.isDebug) return;
        // =======需要随平台扩展========
        if (this.checkVersionWithDot("2.6.0") > 0) return;
        if (this.nativeAd == null) {
            this.nativeAd = this.getCurPlatform.createNativeAd({
                adUnitId: this.nativeID,
            })

            this.nativeAd.onError(err => {
                console.log(this.TAG, "原生广告加载失败", JSON.stringify(err));
            })
        }


        let loadListener = res => {
            let nativeCurrentAd;
            if (res && res.adList) {
                nativeCurrentAd = res.adList.pop();
                this.nativeAd.reportAdShow({ adId: nativeCurrentAd.adId.toString() });
                console.debug(this.TAG, "原生广告参数", JSON.stringify(nativeCurrentAd));
                callback.call(caller, true, nativeCurrentAd);
                // callback(true, nativeCurrentAd);
            }
        }
        this.nativeAd.offLoad(loadListener);
        this.nativeAd.onLoad(loadListener);
    }

    onNativeAdClick(adID: string) {
        // 注意：需要先调用reportAdShow上报广告曝光，才能调用reportAdClick去上报点击！！！
        if (this.nativeAd && adID) {
            this.nativeAd.reportAdClick({ adId: adID });
            console.debug(this.TAG, "nativeAd 上报了click事件");
        }
    }

    /**
     * 判断两次请求之间是否超过了规定的时间间隔TIME_INTERVAL
     * @returns true:表示可以请求  false：表示还在时间间隔不可以请求
     */
    private canRequestByTimeInterval(): boolean {
        let nowTime = new Date().getTime();
        if (this.timeTmp == 0) {
            this.timeTmp = nowTime
            return true;
        } else if (nowTime - this.timeTmp > this.TIME_INTERVAL) {
            return true;
        }
        return false;

    }

    /**
     * 对比版本号 0:相等  1:v1>v2  -1:v1<v2
     * checkVersionWithDot(xx) > 0  return
     * @param v1 
     * @param v2 
     */
    private checkVersionWithDot(v1: any, v2?: any) {
        return -1;
        v1 = v1.split('.')
        v2 = v2 || this.getCurPlatform.getSystemInfoSync().SDKVersion;
        v2 = v2.split('.')
        const len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (let i = 0; i < len; i++) {
            const num1 = parseInt(v1[i])
            const num2 = parseInt(v2[i])
            if (num1 > num2) {
                console.log(this.TAG, "运行版本号小于API最低版本要求");
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }

        return 0
    }

    /**
    * 对比版本号 0:相等  1:v1>v2  -1:v1<v2
    * checkVersionWithNum(xx) > 0  return
    * @param v1 
    * @param v2 
    */
    private checkVersionWithNum(v1: any, v2?: any) {
        v1 = v1
        v2 = v2 || this.getCurPlatform.getSystemInfoSync().SDKVersion;
        if (v1 == v2) return 0;
        if (v1 > v2) {
            console.log(this.TAG, "运行版本号小于API最低版本要求");
            return 1;
        }
        return -1;
    }

}
// let myAdManager = new MyAdManager();
// export { myAdManager }


