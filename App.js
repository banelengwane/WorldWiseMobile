import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CitiesProvider } from "./src/context/CitiesContext";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: '#00c466',
      tabBarStyle: { backgroundColor: '#2d3435'},
      headerStyle: { backgroundColor: '#2d3436' },
      headerTintColor: '#fff'
    }}>
      <Tab.Screen name="Map View" component={MapScreen} />
      <Tab.Screen name="Visited Cities" component={CitiesListScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <CitiesProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerStyle: { backgroundColor: '#2d3436'},
          headerTintColor:'#fff'
        }}>
          {/* Main app layout */}
          <Stack.Screen name="Home" component={AppTabs} options={{ headerShown: false }} />
          {/* Form and detail views overlay over tabs stack */}
          <Stack.Screen name="AddCityForm" component={AddCityFormScreen} options={{ title: 'Add Visited Location'}} />
        </Stack.Navigator>
      </NavigationContainer>
    </CitiesProvider>
  );
}