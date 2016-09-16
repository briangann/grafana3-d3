
declare module 'grafana-sdk-test' {
  import {Emitter} from 'grafana-sdk-test/app/core/utils/emitter.d.ts';
  export {Emitter};

  import {PanelCtrl} from 'grafana-sdk-test/app/features/panel/panel_ctrl.d.ts';
  import {MetricsPanelCtrl} from 'grafana-sdk-test/app/features/panel/metrics_panel_ctrl.d.ts';
  export {PanelCtrl, MetricsPanelCtrl};

  export interface Window { grafanaBootData: any; }

}
