#!/usr/bin/node

/* Bumbleberry broke when BikeBike was dockerized, and was updated to more recent and secure Ruby libraries.
   This means that it no longer updates properly without breaking BikeBike.  In the absense of using Bumbleberry 
   directly to update the css, when browser version are identified by BikeBike, if they don't exist in /public/stylesheets/* 
   the browser renders a responsive view, which doesn't look right for normal size screens.

   Godwin recommended using the most recent css for the newer versions.  This works well for modern browsers.
   To enable this feat, the most recent browsers have to be identified, and the css from the most recent version
   has to be copied over to the newer version.  The irony is we could avoid this exercise, and only support modern browsers
   with one css file, but in the spirit of browser justice let's not assume obscure browsers are not being used anymore.

   The only disadvantage to this approach would be if a new browser with unknown css arose.  Fortunately, this
   probably won't be an issue for a long time to come, since new browsers projects almost always adopt the identity of a major
   engine:  and_chr, and_ff, and_qq, and_uc, android, baidu, bb, chrome, edge, firefox, ie, ie_mob, ios_saf, kaios, op_mini, 
   op_mobm, opera, safari, samsung

   If a new engine does arise, we will deal with that issue when it occurs.

*/

/* retrieves all relevant browers - using default - https://browsersl.ist/
baidu:
    { 
        name: 'baidu',
        versions: [ '13.18' ],
        released: [ '13.18' ],
        releaseDate: { '13.18': 1663027200 } 
    }
*/
const browserlist = require('browserslist');
const path = require('path');
const fs = require('fs');
const { version } = require('process');

// three directories will be parsed: application, admin, web-fonts

const regex = /.css$/g;
const d = ["admin", "application", "web-fonts"];

d.forEach((dir) => {
    caniuse(dir);
});

function caniuse(dir) {
    const directory = path.join(__dirname, 'public/stylesheets', dir);
    const directoryFiles = {};
    
    fs.readdir(directory, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach((file) => {
            if (file.match(regex)) {
                //console.log(file)
                const browserType = file.split('-', 2)[0];
                const bv = file.split('-', 2)[1];
                const browserVersion = bv.split('.css', 2)[0];
                if (directoryFiles[browserType] === undefined) {
                    directoryFiles[browserType] = [browserVersion];
                } else {
                    directoryFiles[browserType].push(browserVersion);
                }
            }
        });

        // Here's where we process the files according to these rules
        // RULES
        //
        // Find all versions that don't exist for each browser, by comparing to browserlist versions for each browser.
        // The most recent css version of the browser will be copied over to each of those newer caniuse versions.
        // Fortunately, caniuse versions are sequential in order, so they can be compared easily by beginning at the most recent 
        // caniuse version, and stepping down to a version that matches an existing version
        // 
        // In some cases, one or more versions of a browser exist, but they don't exist in the browserlist versions.
        // This can be tested if a browser file exists with no matching version.  In this case, copy the most recent file
        // to any new browserlist versions.  Example: and_chr, and_ff
        //
        // If all versions of a browser exists in browerlist, and are exact matches,
        // no copying is required. Example: op_mini-all and (bb-7 & bb-10).
        // We assume we know all engines that ever existed :)
        for (const browser in directoryFiles) {

            // This finds the differences between browserlist and the files in the directory
            difference = browserlist.data[browser].versions.filter(x => !directoryFiles[browser].includes(x));
            // This estables if there are any common items between the two arrays
            const commonality = browserlist.data[browser].versions.some(item => directoryFiles[browser].includes(item));

            // we only have to copy the most recent css when there is a difference
            const browserVersions = browserlist.data[browser].versions;
            if (difference.length) {
                // console.log(browser + ":")
                // console.log("Commonality is", commonality);
                // console.log("Directory Files", directoryFiles[browser]);
                // console.log("Difference", difference);
                // Step down from caniuse versions until there is a match in the directory.
                let c = 1;
                if (commonality) {
                    while (browserVersions[browserVersions.length - c]) {
                        let bV = browserVersions[browserVersions.length - c];
                        // Use this as the file in the directory to be copied over to the different versions if there is a match.
                        if (directoryFiles[browser].includes(bV)) {
                            // console.log("Found", browser + " " + bV);
                            const recentFile = path.join(directory, browser + "-" + bV + ".css");
                            // console.log(recentFile)
                            difference.forEach((ver) => {
                                let newFile = path.join(__dirname, "public/stylesheets", dir, browser + "-" + ver + ".css");

                                fs.copyFile(recentFile, newFile, (err) => {
                                    if (err) {
                                        console.log("Error Found:", err);
                                    } else {
                                        // console.log("copied " + recentFile + " to " + newFile);
                                    }
                                });
                            });
                            break;
                        }
                        // console.log(browserVersions[browserVersions.length - c]);
                        c++;
                    }
                }




                // If there is no match, use the most recent version in the directory to copy over to the different versions
                // It's a safe choice to use the last element as the most recent version
                else {
                    const rV = directoryFiles[browser][directoryFiles[browser].length - 1];
                    const recentFile = path.join(directory, browser + "-" + rV + ".css");
                    difference.forEach((ver) => {
                        let newFile = path.join(__dirname, "public/stylesheets", dir, browser + "-" + ver + ".css");

                        fs.copyFile(recentFile, newFile, (err) => {
                            if (err) {
                                console.log("Error Found:", err);
                            } else {
                                // console.log("copied " + recentFile + " to " + newFile);
                            }
                        });

                    });
                }
            }
        }

    });
}
