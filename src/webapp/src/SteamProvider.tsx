export const openWinSteam = (redirect: string) => new Promise<string>((resolve, reject) => {
    const scopes = 'identify+email';

    try {
        var loading = true;
        const endPoint = `https://steamcommunity.com/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=checkid_setup&openid.return_to=${redirect}/profile/connections/callback?state=d5083c416b1df43325a742551826c414&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;
        const strWindowFeatures = 'location=yes,height=660,width=540,scrollbars=no,status=yes';
        const steamWindow = window.open(endPoint,
            'steamLoginNav',
            strWindowFeatures
        );

        const closeWindow = () => {
            loading = false;
            steamWindow?.close();
        };

        const steamIntervalHash = setInterval(() => {
            if (steamWindow?.closed) {
                clearInterval(steamIntervalHash);
                reject({
                    message: ''
                });
            }

            try {
                const search = steamWindow?.location.search;

                if (search) {
                    const errorRegex = search.match(/error=([^&]*)/);
                    const steamIDRegex = search.match(/openid%2Fid%2F([^&]*)/);
                    if (steamIDRegex) {
                        const steamID = steamIDRegex[1];
                        if (steamID) {
                            loading = false;
                            clearInterval(steamIntervalHash);
                            closeWindow();
                            resolve(steamID);
                        }
                    }
                    if (errorRegex) {
                        const error = errorRegex[1];
                        if (error) {
                            // when user press cancel
                            if (error === 'access_denied') {
                                loading = false;
                                clearInterval(steamIntervalHash);
                                closeWindow();
                                reject({
                                    message:''
                                });
                            }
                        }
                        loading = false;
                        clearInterval(steamIntervalHash);
                        closeWindow();
                        reject({
                            message: ''
                        });
                    }
                }
            } catch (e) {
                loading = false;
                return null;
            }
        }, 100);

    } catch (e) {
        console.log('Error', e);
        loading = false;
        reject('Error');
    }
})