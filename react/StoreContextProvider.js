import React, { Component } from 'react'
import { Helmet } from 'render'
import PropTypes from 'prop-types'

import { gtmScript, gtmFrame} from './scripts/gtm'
import { DataLayerProvider } from './components/withDataLayer'

const APP_LOCATOR = 'vtex.store'

class StoreContextProvider extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  pushToDataLayer = obj => {
    window.dataLayer.push(obj)
  }

  render() {
    const settings = this.context.getSettings(APP_LOCATOR) || {}
    window.dataLayer = window.dataLayer || []
    const {gtmId} = settings
    const scripts = gtmId ? [{
      'type': 'application/javascript',
      'innerHTML': gtmScript(gtmId),
    }] : []
    const noscripts = gtmId ? [{id: "gtm_frame", innerHTML: gtmFrame(gtmId)}] : []
    return (
      <DataLayerProvider
        value={{
          dataLayer: window.dataLayer,
          set: this.pushToDataLayer,
        }}
      >
      <Helmet script={scripts} noscript={noscripts} />
      <div className="vtex-store__template">{this.props.children}</div>
      </DataLayerProvider>
    )
  }
}

StoreContextProvider.contextTypes = {
  getSettings: PropTypes.func,
}

export default StoreContextProvider