import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'maplibre-gl/dist/maplibre-gl.css';
import { Provider } from 'react-redux';
import store from '@/components/redux/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={ store }>
      <Component {...pageProps} />
    </Provider>
  )
}
