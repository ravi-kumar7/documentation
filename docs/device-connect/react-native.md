# Device Connect: React Native Integration
Device connect can be integrated to mobile apps via React Native to share customers' device data.

## Step 1: Adding Dependency
Add the Gradle dependency in your Native app's `android` folder.
```groovy
implementation('in.finbox:mobileriskmanager:2.1.5:pfm-release@aar') {  
    transitive = true  
}
```

In the project level `build.gradle` add the Repository path as follows:

```groovy
maven {  
    url "s3://risk-manager-android-sdk/artifacts"  
    credentials(AwsCredentials) {  
        accessKey = "<access-key-provided-in-mail>"
	secretKey = "<secret-key-provided-in-mail>"  
    }
}
```


## Step 2: Creating the bridge

Once the dependencies are added we need to add 2 classes to create a bridge between Native SDK and React.

Lets name the first class `RiskSdkModule.java`

```java
package <your-app-package>;

import androidx.annotation.NonNull;  
import com.facebook.react.bridge.ReactApplicationContext;  
import com.facebook.react.bridge.ReactContextBaseJavaModule;  
import com.facebook.react.bridge.ReactMethod;  
import com.facebook.react.bridge.Callback;  
import java.util.concurrent.TimeUnit;  
import in.finbox.mobileriskmanager.FinBox;  
  
public class RiskSdkModule extends ReactContextBaseJavaModule {  
  
    private final ReactApplicationContext reactContext;  
  
    public RiskSdkModule(ReactApplicationContext reactContext) {  
        super(reactContext);  
        this.reactContext = reactContext;  
    }  
  
    @Override  
    public String getName() {  
        return "RiskSdk";  
    }  
  
    @ReactMethod  
    public void createUser(@NonNull String apiKey,  
                           @NonNull String username,  
                           final Callback errorCallback,  
                           final Callback successCallback) {  
        FinBox.createUser(apiKey, username, new FinBox.FinBoxAuthCallback() {  
            @Override  
            public void onSuccess(@NonNull String s) {  
                successCallback.invoke(s);  
            }  
  
            @Override  
	    public void onError(int i) {  
                errorCallback.invoke(i);  
            }  
        });  
    }  
  
    @ReactMethod  
    public void startPeriodicSync(Integer duration) {  
        FinBox finbox = new FinBox();  
        finbox.setRealTime(true);  
        finbox.setSyncFrequency(TimeUnit.HOURS.toSeconds(duration));  
        finbox.startPeriodicSync();  
    }  
}

```

2nd class required is a package class to bind the module that we just created. Lets name the class `RiskSdkPackage.java`

```java
package <your-app-package>;
  
import java.util.Arrays;  
import java.util.Collections;  
import java.util.List;  
import com.facebook.react.ReactPackage;  
import com.facebook.react.bridge.NativeModule;  
import com.facebook.react.bridge.ReactApplicationContext;  
import com.facebook.react.uimanager.ViewManager;  
  
public class RiskSdkPackage implements ReactPackage {  
    @Override  
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {  
        return Arrays.<NativeModule>asList(new RiskSdkModule(reactContext));  
    }  
  
    @Override  
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {  
        return Collections.emptyList();  
    }  
}
```

We need to add this Package class to the MainApplication class for the bridge to complete.

Final change required is in the `MainApplication` class of your native app.

```java
@Override  
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        ....
        new RiskSdkPackage(),
        ...
    );
}
```
That's it. Now that the bridge is complete we need to go to React to call the method to trigger the SDK.

## Step 3: React methods
Once the bridge is complete, we should be able to call the methods exposed using the `NativeModules`. Below is a snippet of react code to call the exposed methods.
`createUser` function creates a user with the `username` provided and the periodic sync will be for the assigned `username`
Once the `createUser` is successful you need to call `startPeriodicSync` with the duration to start fetching data from device.

```jsx
import { NativeModules } from 'react-native';
const { RiskSdk } = NativeModules

//Function to trigger RiskSdk
const callModule = () => {
    RiskSdk.createUser(
        "<API_KEY>",
        "<USERNAME>",
        (errorStatus) => {
	    // Error Callback
            console.log("Error status -> ", errorStatus)
        }, 
        (msg) => {
            // Success Callback, Call the periodic sync once the user has been created
	    console.log("Final message", msg)
	    RiskSdk.startPeriodicSync(12) //Start the sync periodically after every 12 hour
	}
    )
}
```

