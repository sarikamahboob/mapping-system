import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'maplibre-gl/dist/maplibre-gl.css';
import { Provider } from 'react-redux';
import store from '@/components/redux/store';
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={ store }>
      <Script strategy='beforeInteractive' src="https://js.pusher.com/7.0/pusher.min.js" />
      <Component {...pageProps} />
    </Provider>
  )
}
