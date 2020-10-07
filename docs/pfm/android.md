Personal Finance Manager SDK
============================

Personal Finance Manager SDK helps people manage their financial activities. These include but not limited to the spends made on Food, Investments, Credit Card Bills Paid and more.


Requirements
------------

PFM SDK works on Android 5.0+ (API level 21+), on Java 8+ and AndroidX.


Add Dependency
--------------

In the project level `build.gradle` file, add the repository urls to all `allprojects` block.

<CodeSwitcher :languages="{kotlin:'Kotlin',groovy:'Groovy'}">
<template v-slot:kotlin>

```kotlin
maven {
    setUrl("s3://risk-manager-android-sdk/artifacts")
    credentials(AwsCredentials::class) {
        accessKey = <ACCESS_KEY>
        secretKey = <SECRET_KEY>
    }
}
maven { setUrl("https://jitpack.io") }
```

</template>
<template v-slot:groovy>

```groovy
maven {
    url "s3://risk-manager-android-sdk/artifacts"
    credentials(AwsCredentials) {
        accessKey = <ACCESS_KEY>
        secretKey = <SECRET_KEY>
    }
}
maven { url 'https://jitpack.io' }
```

</template>
</CodeSwitcher>

Add the Personal Finance Manager sdk to module level `build.gradle` file.

<CodeSwitcher :languages="{kotlin:'Kotlin',groovy:'Groovy'}">
<template v-slot:kotlin>

```kotlin
implementation("in.finbox:mobileriskmanager:<DC_SDK_VERSION>:parent-release@aar") {
    isTransitive = true
}
implementation("in.finbox.personalfinancemanager:core:<PFM_SDK_VERSION>:release@aar") {
    isTransitive = true
}
implementation("in.finbox:common:<COMMON_SDK_VERSION>:release@aar") {
    isTransitive = true
}
implementation("in.finbox:logger:<LOGGER_SDK_VERSION>:release@aar") {
    isTransitive = true
}
```

</template>
<template v-slot:groovy>

```groovy
implementation('in.finbox:mobileriskmanager:<DC_SDK_VERSION>:parent-release@aar') {
    transitive = true
}
implementation('in.finbox.personalfinancemanager:core:<PFM_SDK_VERSION>:release@aar') {
        transitive = true
    }
implementation ('in.finbox:common:<COMMON_SDK_VERSION>:release@aar') {
    transitive = true
}
implementation ('in.finbox:logger:<LOGGER_SDK_VERSION>:release@aar') {
    transitive = true
}
```

</template>
</CodeSwitcher>

::: warning NOTE
Following will be shared by FinBox team at the time of integration:
- `ACCESS_KEY`
- `SECRET_KEY`
- `DC_SDK_VERSION`
- `PFM_SDK_VERSION`
- `COMMON_SDK_VERSION`
- `LOGGER_SDK_VERSION`
:::

Personal Finance Manager Screen
-------------------------------

The developer can show the finance manager UI by starting the activity.

__Display Activity__

    startActivity(Intent(this, HomeActivity::class.java))


Customize Themes and Colors to match the brand
----------------------------------------------

__App Bar Text__

Currently, the app bar shows the name of the application, You can update app bar text by the updating the `app_name` in the `strings.xml` file.

    <string name="app_name">FinBox</string>

__App Bar Colors, Status Bar Color__

App bar and Status colors can be overridden by overwriting `colorPrimary` and `colorPrimaryDark` colors in the `colors.xml`.

    <color name="colorPrimary">#00C398</color>
    <color name="colorPrimaryDark">#00574B</color>

__Fonts__

Default font can be changed to the desired font by specifying `fontFamily` under the style with name `AppTheme.FinBox`.

    <style name="AppTheme.FinBox" parent="AppTheme.NoActionBar">
        <item name="android:fontFamily">@font/lato</item>
    </style>

__Window Background Color__

Use `windowBackground` item to update the background color of the screens.

    <style name="AppTheme.FinBox" parent="AppTheme.NoActionBar">
        <item name="android:windowBackground">@color/colorBlackText</item>
    </style>

__Category Color and Category Icons__

Colors specific for the category shown in the UI are customizable on the backend in addition to their logos.


PFM Customizable Notifications
=============================

1. Extend `FinanceMessagingService` instead of extending `FirebaseMessagingService`.

```java

    public class MyMessagingService extends FinanceMessagingService {
        
    }

```
   
2. Override the following methods and provide a pending intent that specifies the destinations.

```java

    @NotNull
    @Override
    public PendingIntent generateAccountSpendsIntent(@NotNull Bundle bundle) {
        final Intent intent = new Intent(this, LoginActivity.class);
        bundle.putInt(REQUEST_CODE_NOTIFICATION_KEY_NAME, REQUEST_CODE_WEEK_ACCOUNT_SPEND);
        intent.putExtras(bundle);
        return PendingIntent.getActivity(this,
                REQUEST_CODE_WEEK_ACCOUNT_SPEND,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT);
    }


    @NotNull
    @Override
    public PendingIntent generateHomeIntent() {
        final Intent intent = new Intent(this, LoginActivity.class);
        intent.putExtra(REQUEST_CODE_NOTIFICATION_KEY_NAME, REQUEST_CODE_WEEK_HOME);
        return PendingIntent.getActivity(this,
                REQUEST_CODE_WEEK_HOME,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT);
    }


    @NotNull
    @Override
    public PendingIntent generateWeeklySpendIntent(@NotNull Bundle bundle) {
        final Intent intent = new Intent(this, LoginActivity.class);
        bundle.putInt(REQUEST_CODE_NOTIFICATION_KEY_NAME, REQUEST_CODE_WEEK_SPEND);
        intent.putExtras(bundle);
        return PendingIntent.getActivity(this,
                REQUEST_CODE_WEEK_SPEND,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT);
    }



    @NotNull
    @Override
    public PendingIntent getUnCategorizedIntent(@NotNull Bundle bundle) {
        final Intent intent = new Intent(this, LoginActivity.class);
        bundle.putInt(REQUEST_CODE_NOTIFICATION_KEY_NAME, REQUEST_CODE_CATEGORIZE_SPEND);
        intent.putExtras(bundle);
        return PendingIntent.getActivity(this,
                REQUEST_CODE_CATEGORIZE_SPEND,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT);
    }

```

**generateAccountSpendsIntent** - Generates the notification content that shows information to the user about the spends made for the account. When clicked, the user is taken to the screen where list of spends for the account during the specified duration is shown.

**generateHomeIntent** - Notification shows general information and takes the user to the home screen when clicked.

**generateWeeklySpendIntent** - Generates the notification content that shows insgihts about the spends made for the week. Once clicked, the user is taken to the screen where the list of all the spends made during the week are shown.

**getUnCategorizedIntent** - Requests the user to categorize the un-categorized transactions. When clicked on the notification, the screen shows the list of transactions that are available to be manually categorized.


3. Once the login is successful at the `LoginActivity`, take the user to the `DashboardActivity`. Now, check the extras and navigate the user to the `ExpenseActivity`.

```java
    private void decideDestinationFragment(@NotNull final Bundle extras) {
        final int requestCode = extras.getInt(REQUEST_CODE_NOTIFICATION_KEY_NAME, -1);
        if (requestCode == REQUEST_CODE_WEEK_ACCOUNT_SPEND) {
            showAccountSpendFragment(extras);
        } else if (requestCode == REQUEST_CODE_WEEK_SPEND) {
            showWeekSpendFragment(extras);
        } else if (requestCode == REQUEST_CODE_CATEGORIZE_SPEND) {
            showCategorizeFragment(extras);
        } else if (requestCode == REQUEST_CODE_WEEK_HOME) {
            showIntroFragment(extras);
        }
    }



    private void showAccountSpendFragment(@NotNull final Bundle bundle) {
        final TaskStackBuilder createTaskStackBuilder = new NavDeepLinkBuilder(this)
                .setComponentName(ExpenseActivity.class)
                .setGraph(R.navigation.home_navigation)
                .setDestination(R.id.accountSpendFragment)
                .setArguments(bundle)
                .createTaskStackBuilder();
        createTaskStackBuilder.startActivities();
    }

    private void showWeekSpendFragment(@NotNull final Bundle bundle) {
        final TaskStackBuilder createTaskStackBuilder = new NavDeepLinkBuilder(this)
                .setComponentName(ExpenseActivity.class)
                .setGraph(R.navigation.home_navigation)
                .setDestination(R.id.weeklySpendFragment)
                .setArguments(bundle)
                .createTaskStackBuilder();
        createTaskStackBuilder.startActivities();
    }

    private void showCategorizeFragment(@NotNull final Bundle bundle) {
        final TaskStackBuilder createTaskStackBuilder = new NavDeepLinkBuilder(this)
                .setComponentName(ExpenseActivity.class)
                .setGraph(R.navigation.home_navigation)
                .setDestination(R.id.unCategorizedFragment)
                .setArguments(bundle)
                .createTaskStackBuilder();
        createTaskStackBuilder.startActivities();
    }

    private void showIntroFragment(@NotNull final Bundle bundle) {
        final TaskStackBuilder createTaskStackBuilder = new NavDeepLinkBuilder(this)
                .setComponentName(ExpenseActivity.class)
                .setGraph(R.navigation.home_navigation)
                .setDestination(R.id.introViewPagerFragment)
                .setArguments(bundle)
                .createTaskStackBuilder();
        createTaskStackBuilder.startActivities();
    }

```


4. Forward the notifications to the `FinanceMessagingService`.

```java

    if (FinanceMessagingService.forwardToFinBoxPfmSdk(message.getData())) {
        super.onMessageReceived(message);
        return
    }

```