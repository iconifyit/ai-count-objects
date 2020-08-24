/**
 * USAGE:
 *
 * 1. Place this script in Applications > Adobe Illustrator > Presets > en_US > Scripts
 * 2. Restart Adobe Illustrator to activate the script
 * 3. The script will be available under menu File > Scripts > Count Objects
 */
/**
 * LICENSE & COPYRIGHT
 *
 *   You are free to use, modify, and distribute this script as you see fit.
 *   No credit is required but would be greatly appreciated.
 *
 *   Scott Lewis - scott@iconify.it
 *   http://github.com/iconifyit
 *   http://iconify.it
 *
 *   THIS SCRIPT IS OFFERED AS-IS WITHOUT ANY WARRANTY OR GUARANTEES OF ANY KIND.
 *   YOU USE THIS SCRIPT COMPLETELY AT YOUR OWN RISK AND UNDER NO CIRCUMSTANCES WILL
 *   THE DEVELOPER AND/OR DISTRIBUTOR OF THIS SCRIPT BE HELD LIABLE FOR DAMAGES OF
 *   ANY KIND INCLUDING LOSS OF DATA OR DAMAGE TO HARDWARE OR SOFTWARE. IF YOU DO
 *   NOT AGREE TO THESE TERMS, DO NOT USE THIS SCRIPT.
 */

/**
 * Declare the target app.
 */
#target illustrator

/**
 * Include the libraries we need.
 */
#includepath "/Users/scott/github/iconify/jsx-common/";


#include "JSON.jsxinc";
#include "Utils.jsxinc";
#include "Logger.jsxinc";

/**
 * Name that script.
 */
#script "Count Objects";

/**
 * Disable Illustrator's alerts.
 */
Utils.displayAlertsOff();

// End global setup

function doDisplayDialog() {

    var response     = false;
    var dialogWidth  = 450;
    var dialogHeight = 160;
    var dialogLeft   = 550;
    var dialogTop    = 300;

    if ( bounds = Utils.getScreenSize() ) {
        dialogLeft = Math.abs(Math.ceil((bounds.width/2) - (dialogWidth/2)));
    }

    /**
     * Dialog bounds: [ Left, TOP, RIGHT, BOTTOM ]
     * default: //550, 350, 1000, 800
     */

    var dialog = new Window(
        "dialog", "Layer Toggler", [
            dialogLeft,
            dialogTop,
            dialogLeft + dialogWidth,
            dialogTop + dialogHeight
        ]
    );
    
    try {

        /**
         * Row height
         * @type {number}
         */
        var rh = 30;

        /**
         * Column width
         * @type {number}
         */
        var cw  = 112;

        var c1  = 30;
        var c1w = c1 + 100;

        var c2  = c1 + 190;
        var c2w = c2 + 150;

        var p1 = 16;
        var p2 = dialogWidth - 16;

        var r1 = 40;

        // Sections

        dialog.tokenLabel             = dialog.add('statictext', [c1, 40, c1w, 70], "Search String");
        dialog.token                  = dialog.add('edittext',   [c2, 40, c2w, 70], '001');
        dialog.token.active           = true;

		dialog.resetBtn               = dialog.add('button',  [20,  100, 120, 125], "Reset",  {name: 'reset'});
        dialog.cancelBtn              = dialog.add('button',  [222, 100, 322, 125], "Cancel", {name: 'cancel'});
        dialog.openBtn                = dialog.add('button',  [334, 100, 434, 125], "Find",   {name: 'ok'});

        dialog.cancelBtn.onClick = function() {
            dialog.close();
            response = false;
            return false;
        };

        dialog.resetBtn.onClick = function() {
        
        	dialog.close();
        
			var doc    = app.activeDocument;
			var layers = doc.layers;
			
			try {
				for ( i = 0; i < layers.length; i++ ) {
					layers[i].visible = true;   
				}
			}
			catch(e) {
				alert(e);
			}
            
            response = false;
            return false;
        }

        dialog.openBtn.onClick = function() {
						
			dialog.close();
			response = dialog.token.text;
            return true;
        };

        dialog.show();
    }
    catch(ex) {
        logger.error(ex);
        alert(ex);
    }
    return response;
}

var Module = (function(CONFIG) {

    /**
     * Create a new instance of this module.
     * @constructor
     */
    var Instance = function() {
        app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

        if (app.documents.length > 0) {

            var doc   = app.activeDocument;

			var doc    = app.activeDocument;
			var layers = doc.layers;
			
			if ( token = doDisplayDialog() ) {		
				try {
					for ( i = 0; i < layers.length; i++ ) {
						var layer = layers[i];
						if ( layer.name.substr(0, token.length) == token ) {
							layer.visible = true;   
						}
						else {
							layer.visible = false;
						}
					}
				}
				catch(e) {
					alert(e);
				}
			}

        }
        else  {
            alert(localize({en_US: 'There are no open documents'}))
        }
    }

    /**
     * Returns the public module object.
     */
    return {
        /**
         * Runs the module code.
         */
        run: function() {
            new Instance();
        }
    }

})({
    APP_NAME  : 'ai-count-objects'
});

Module.run();

Utils.displayAlertsOn();