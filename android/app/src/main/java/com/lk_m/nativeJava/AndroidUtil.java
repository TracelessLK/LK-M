package com.traceless.nativeJava;

import android.widget.Toast;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;
import java.io.File;

public class AndroidUtil extends ReactContextBaseJavaModule {

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";
   private final ReactApplicationContext reactContext;

  public AndroidUtil(ReactApplicationContext reactContext) {
    super(reactContext);
     this.reactContext = reactContext;
  }

    @Override
    public String getName() {
      return "ToastExample";
    }

    @ReactMethod
     private void install(String filePath) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(Uri.fromFile(new File(filePath)),
                "application/vnd.android.package-archive");
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        this.reactContext.startActivity(intent);
         }
     @ReactMethod
        private void test(String test) {
                Log.wtf("tag",test);
        }
}
