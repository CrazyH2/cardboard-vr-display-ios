/**
 * @author crazyh / https://github.com/crazyh2
 */

( function () {

	const _zee = new THREE.Vector3( 0, 0, 1 );

	const _euler = new THREE.Euler();

	const _q0 = new THREE.Quaternion();

	const _q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis


	const _changeEvent = {
		type: 'change'
	};

	class DeviceMotionControls extends THREE.EventDispatcher {

		constructor( object ) {

			super();

			if ( window.isSecureContext === false ) {

				console.error( 'THREE.DeviceMotionControls: DeviceMotionEvent is only available in secure contexts (https)' );

			}

			const scope = this;
			this.object = object;
			this.enabled = true;
            this.deviceMotion = {};
            this.deviceMotionSec = {};
            this.offsetPosition = {
                x: 0,
                y: 0,
                z: 0
            };

            const onDeviceMotionEventSec = function () {

				scope.deviceMotionSec = scope.deviceMotion;

			};

            const onDeviceMotionEvent = function ( event ) {

				scope.deviceMotion = event;

			};

			this.connect = function () {

				// iOS 13+

				if ( window.DeviceMotionEvent !== undefined && typeof window.DeviceMotionEvent.requestPermission === 'function' ) {

					window.DeviceMotionEvent.requestPermission().then( function ( response ) {

						if ( response == 'granted' ) {

							window.addEventListener( 'devicemotion', onDeviceMotionEvent );
                            window.setInterval(onDeviceMotionEventSec, 1000);

						}

					} ).catch( function ( error ) {

						console.error( 'THREE.DeviceMotionControls: Unable to use DeviceMotion API:', error );

					} );

				} else {

					window.addEventListener( 'devicemotion', onDeviceMotionEvent );
                    window.setInterval(onDeviceMotionEventSec, 1000);

				}

				scope.enabled = true;

			};

			this.disconnect = function () {

				window.removeEventListener( 'devicemotion', onDeviceMotionEvent );
                window.clearInterval(onDeviceMotionEventSec, 1000);
				scope.enabled = false;

			};

			this.update = function () {

				if ( scope.enabled === false ) return;
				const device = scope.deviceMotionSec;

				if ( device ) {

                    this.object.translateX(device ? device.acceleration.x : 0);

                    this.object.translateY(device ? device.acceleration.y : 0);

                    this.object.translateZ(device ? device.acceleration.z : 0);

                    device = undefined;

				}

			};

			this.dispose = function () {

				scope.disconnect();

			};

			this.connect();

		}

	}

	THREE.DeviceMotionControls = DeviceMotionControls;

} )();