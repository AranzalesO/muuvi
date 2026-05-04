import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

export function configureOnlineManager() {
  return onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => {
      setOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    }),
  );
}
