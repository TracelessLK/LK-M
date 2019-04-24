package com.traceless;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.clipsub.RNShake.RNShakeEventPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.wenkesj.voice.VoicePackage;
import com.pusherman.networkinfo.RNNetworkInfoPackage;
import com.dooboolab.RNAudioRecorderPlayerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import cn.reactnative.modules.update.UpdatePackage;
import org.reactnative.camera.RNCameraPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import cn.reactnative.modules.update.UpdateContext;
import org.pgsqlite.SQLitePluginPackage;
import com.lk_m.nativeJava.AnExampleReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
   @Override
      protected String getJSBundleFile() {
          return UpdateContext.getBundleUrl(MainApplication.this);
      }
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNShakeEventPackage(),
            new LottiePackage(),
            new VoicePackage(),
            new RNNetworkInfoPackage(),
            new RNAudioRecorderPlayerPackage(),
            new PickerPackage(),
            new ReactNativeRestartPackage(),
            new SvgPackage(),
            new ImagePickerPackage(),
            new ImageResizerPackage(),
            new RNFetchBlobPackage(),
            new UpdatePackage(),
            new RNCameraPackage(),
            new RNDeviceInfo(),
            new VectorIconsPackage(),
            new RNFSPackage(),
            new SQLitePluginPackage(),
            new AnExampleReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
