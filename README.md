# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Library Skia

React Native Skia brings the Skia Graphics Library to React Native. Skia serves as the graphics engine for Google Chrome and Chrome OS, Android, Flutter, Mozilla Firefox and Firefox OS, and many other products.

Checkout the full documentation [here](https://shopify.github.io/react-native-skia).

```typescript
  const handleGenerate = useCallback(() => {
    closeSheet();
    setPath(Skia.Path.Make());

    progress.value = 0;
    requestAnimationFrame(() => {
      const pts = generatePoints();
      const newPath = createPath(pts);
      setPath(newPath);
      progress.value = withTiming(1, { duration: pts.length * 4 });
    })
  }, [MAP_SIZE]);

```

```reach native
     <Canvas style={{ width: MAP_SIZE, height: MAP_SIZE }}>
         <Path
            path={path}
            color="#00fbff"
            style="stroke"
            strokeWidth={5}
            antiAlias
            start={0}
            end={progress}
         />
      </Canvas>

```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
