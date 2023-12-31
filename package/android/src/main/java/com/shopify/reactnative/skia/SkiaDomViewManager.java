package com.shopify.reactnative.skia;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.viewmanagers.SkiaDomViewManagerInterface;
import com.facebook.react.viewmanagers.SkiaDomViewManagerDelegate;

import androidx.annotation.NonNull;

public class SkiaDomViewManager extends SkiaBaseViewManager<SkiaDomView> implements SkiaDomViewManagerInterface<SkiaDomView> {

    protected SkiaDomViewManagerDelegate mDelegate;

    SkiaDomViewManager() {
        mDelegate = new SkiaDomViewManagerDelegate(this);
    }

    protected SkiaDomViewManagerDelegate getDelegate() {
        return mDelegate;
    }

    @NonNull
    @Override
    public String getName() {
        return "SkiaDomView";
    }

    @NonNull
    @Override
    public SkiaDomView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new SkiaDomView(reactContext);
    }
}