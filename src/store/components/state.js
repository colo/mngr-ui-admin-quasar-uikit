export default function () {
  return {
    // all: {},
    _default: {

      '1': [{
        id: 0,
        component: 'admin-lte-box-solid'
        // defaultSize: 2
      }],
      '2': [
        { id: 2, slot: 'hello', defaultSize: 2 }],
      '3': [{
        component: 'q-btn',
        // defaultSize: 2,
        options: {
          // round: true,
          label: 'edit/preview',
          style: 'position: relative'
          // '@click': "$emit('disableGrid')"
        },
        events: {
          click: 'disableGrid'
        }
        // componentProps: "round color: 'primary'"
      }],
      '4': [{
        component: 'q-btn',
        // defaultSize: 2,
        options: {
          // round: true,
          label: 'draggables',
          style: 'position: relative'
          // '@click': "$emit('disableGrid')"
        },
        events: {
          click: 'disableEdit'
        }
        // componentProps: "round color: 'primary'"
      }],
      '5': [{
        component: 'admin-lte-box-solid'
        // defaultSize: 2
      }]
    // //   '4': { i: '4', component: 'example-component', defaultSize: 2 }
    }

    // _default: {
    //   layout: [
    //     { 'x': 0,
    //       'y': 0,
    //       'w': 10,
    //       'h': 2,
    //       'i': '0',
    //       elements: [
    //       ]
    //       // 'type': 'q-btn',
    //       // options: { color: 'white', 'text-color': 'black', label: 'Standard' }
    //     },
    //     // { 'x': 10,
    //     //   'y': 0,
    //     //   'w': 2,
    //     //   'h': 2,
    //     //   'i': '1',
    //     //   // options: {
    //     //   //   static: true
    //     //   // },
    //     //   elements: [
    //     //     {
    //     //       // 'type': 'edit-btn',
    //     //       'type': 'q-btn',
    //     //       events: { click: 'disableGrid' },
    //     //       options: {
    //     //         round: true,
    //     //         color: 'primary'
    //     //         // icon: 'shopping_cart',
    //     //         // 'v-on': '{ click: disableGrid }',
    //     //         // 'v-on:click': '"disableGrid"',
    //     //         // 'v-on:click': '$emit("disableGrid")'
    //     //         // 'flat': true
    //     //         //   'bordered': true
    //     //         //   // class: 'bg-grey-9',
    //     //         //   // text: 'test' +
    //     //         //   // '\nsome more'
    //     //       }
    //     //     }
    //     //   ]
    //     //   // 'type': 'q-btn',
    //     //   // options: { color: 'white', 'text-color': 'black', label: 'Standard' }
    //     // },
    //     { 'x': 0,
    //       'y': 1,
    //       'w': 12,
    //       'h': 2,
    //       'i': '2',
    //       elements: [
    //       ]
    //       // 'type': 'q-btn',
    //       // options: { color: 'white', 'text-color': 'black', label: 'Standard' }
    //     }
    //   ],
    //
    //   isDraggable: true,
    //   isResizable: true,
    //   preview: false,
    //   contenteditable: true
    // }
  }
}
