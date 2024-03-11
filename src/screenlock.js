 // © Copyright 2022 CrazyH
 // This file was originally made by CrazyH
 // Do not rebrand if you are distributing it
 // © Copyright 2022 CrazyH

import IOSUtils from "./libraries/iosutils.module.js";
import ScreenLockApi from "./libraries/screenlock-api.module.js";

class ScreenLock {
    constructor(container = null) {
        this.container = document.body;//container;
        this.enabled = false;

        if (!ScreenLockApi.supportsScreenLock) ScreenLockApi.lockElement(this.container);

        // IOS Orientation permission check
        if (IOSUtils.isIOS && IOSUtils.requireOrientationPermission) {
            const onIOSClick = () => {
                IOSUtils.requestOrientationPermissions().then((response) => {
                    if ( response == 'granted' ) {
                        window.addEventListener( 'orientationchange', () => {}, false );
                        window.addEventListener( 'deviceorientation', () => {}, false );
                    }
                });

                this.container.removeEventListener( 'click', onIOSClick);
            };
            this.container.addEventListener( 'click', onIOSClick);
        };
    };

    enable(e) {
        if (this.enabled) return;

        ScreenLockApi.lock("landscape").then(() => {}).catch(() => {});
        this.enabled = true;
    };

    disable(e) {
        if (!this.enabled) return;

        ScreenLockApi.unlock();
        this.enabled = false;
    };
};

export default ScreenLock;