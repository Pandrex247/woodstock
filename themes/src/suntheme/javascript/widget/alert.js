//
// The contents of this file are subject to the terms
// of the Common Development and Distribution License
// (the License).  You may not use this file except in
// compliance with the License.
// 
// You can obtain a copy of the license at
// https://woodstock.dev.java.net/public/CDDLv1.0.html.
// See the License for the specific language governing
// permissions and limitations under the License.
// 
// When distributing Covered Code, include this CDDL
// Header Notice in each file and include the License file
// at https://woodstock.dev.java.net/public/CDDLv1.0.html.
// If applicable, add the following below the CDDL Header,
// with the fields enclosed by brackets [] replaced by
// you own identifying information:
// "Portions Copyrighted [year] [name of copyright owner]"
// 
// Copyright 2007 Sun Microsystems, Inc. All rights reserved.
//

dojo.provide("webui.@THEME@.widget.alert");

dojo.require("dojo.widget.*");
dojo.require("webui.@THEME@.widget.*");

/**
 * This function is used to generate a template based widget.
 *
 * Note: This is considered a private API, do not use.
 */
webui.@THEME@.widget.alert = function() {
    // Register widget.
    dojo.widget.HtmlWidget.call(this);
}

/**
 * This closure is used to process widget events.
 */
webui.@THEME@.widget.alert.event = {
    /**
     * This closure is used to process refresh events.
     */
    refresh: {
        /**
         * Event topics for custom AJAX implementations to listen for.
         */
        beginTopic: "webui_@THEME@_widget_alert_event_refresh_begin",
        endTopic: "webui_@THEME@_widget_alert_event_refresh_end"
    },

    /**
     * This closure is used to process state change events.
     */
    state: {
        /**
         * Event topics for custom AJAX implementations to listen for.
         */
        beginTopic: "webui_@THEME@_widget_alert_event_state_begin",
        endTopic: "webui_@THEME@_widget_alert_event_state_end"
    },

    /**
     * This closure is used to process notification events.
     */
    notification: {
        /**
         * This function is used to process notification events with the following
         * Object literals.
         *
         * <ul>
         *  <li>detail</li>
         *  <li>summary</li>
         *  <li>valid</li>
         * </ul>
         *
         * @param props Key-Value pairs of properties.
         */
        processEvent: function(props) {
            if (props == null) {
                return false;
            }
            return this.setProps({
                summary: props.summary,
                detail: props.detail,
                type: "error",
                visible: !props.valid
            });
        }
    }
}

/**
 * This function is used to fill in template properties.
 *
 * Note: This is called after the buildRendering() function. Anything to be set 
 * only once should be added here; otherwise, use the _setProps() function.
 *
 * @param props Key-Value pairs of properties.
 * @param frag HTML fragment.
 */
webui.@THEME@.widget.alert.fillInTemplate = function(props, frag) {
    webui.@THEME@.widget.alert.superclass.fillInTemplate.call(this, props, frag);

    // Set ids.
    if (this.id) {
        this.bottomLeftContainer.id = this.id + "_bottomLeftContainer";
        this.bottomMiddleContainer.id = this.id + "_bottomMiddleContainer";
        this.bottomRightContainer.id = this.id + "_bottomRightContainer";
        this.detailContainer.id = this.id + "_detailContainer";
        this.imageContainer.id = this.id + "_imageContainer";
        this.leftMiddleContainer.id = this.id + "_leftMiddleContainer";
        this.rightMiddleContainer.id = this.id + "_rightMiddleContainer";
        this.summaryContainer.id = this.id + "_summaryContainer";
        this.topLeftContainer.id = this.id + "_topLeftContainer";
        this.topMiddleContainer.id = this.id + "_topMiddleContainer";
        this.topRightContainer.id = this.id + "_topRightContainer";
        this.detailContainerLink.id = this.id + "_detailContainerLink";
    }
    return true;
}

/**
 * This function is used to get widget properties. Please see the 
 * _setProps() function for a list of supported properties.
 */
webui.@THEME@.widget.alert.getProps = function() {
    var props = webui.@THEME@.widget.alert.superclass.getProps.call(this);

    // Set properties.
    if (this.detail != null) { props.detail = this.detail; }
    if (this.indicators != null) { props.indicators = this.indicators; }
    if (this.summary != null) { props.summary = this.summary; }
    if (this.type != null) { props.type = this.type; }
    if (this.moreInfo != null) { props.moreInfo = this.moreInfo; }
    if (this.spacerImage != null) { props.spacerImage = this.spacerImage; }
    
    return props;
}

/**
 * This function is used to set widget properties with the following 
 * Object literals.
 *
 * <ul>
 *  <li>dir</li>
 *  <li>lang</li>
 *  <li>detail</li>
 *  <li>spacerImage</li>
 *  <li>indicators</li>
 *  <li>id</li>
 *  <li>summary</li>
 *  <li>type</li>
 *  <li>moreInfo</li>
 *  <li>visible</li>
 * </ul>
 *
 * Note: This is considered a private API, do not use. This function should only
 * be invoked through postInitialize() and setProps(). Further, the widget shall
 * be updated only for the given key-value pairs.
 *
 * @param props Key-Value pairs of properties.
 */
webui.@THEME@.widget.alert._setProps = function(props) {
    if (props == null) {
        return false;
    }

    // Set properties.
    if (props.dir) { this.domNode.dir = props.dir; }
    if (props.lang) { this.domNode.lang = props.lang; }    
    
    // Set summary.
    if (props.summary) {
        this.widget.addFragment(this.summaryContainer, props.summary);
    }

    // Set detail.
    if (props.detail) {
        this.widget.addFragment(this.detailContainer, props.detail);
    }

    // Set moreInfo.
    if (props.moreInfo) {
        this.widget.addFragment(this.detailContainerLink, props.moreInfo);
    }

    // Set spacer image.
    if (props.spacerImage) {
        var containers = [
            this.bottomLeftContainer,
            this.bottomMiddleContainer,
            this.bottomRightContainer,
            this.leftMiddleContainer,
            this.rightMiddleContainer,
            this.topLeftContainer,
            this.topMiddleContainer,
            this.topRightContainer];

        // Avoid widget ID collisions.
        for (var i = 0; i < containers.length; i++) {
            if (typeof props != 'string') {
                props.spacerImage.id = this.id + "_spacerImage" + i;
            }
            // Replace container with image.
            if (!dojo.widget.byId(props.spacerImage.id)) {
                this.widget.addFragment(containers[i], props.spacerImage);
            }
        }
    }

    // Set indicator properties.
    if (props.indicators || props.type != null && this.indicators) {
        // Iterate over each indicator.
        for (var i = 0; i < this.indicators.length; i++) {
            // Ensure property exists so we can call setProps just once.
            var indicator = this.indicators[i]; // get current indicator.
            if (indicator == null) {
                indicator = {}; // Avoid updating all props using "this" keyword.
            }

            // Set properties.
            indicator.image.visible = (indicator.type == this.type) ? true: false;
            indicator.image.tabIndex = this.tabIndex;

            // Update/add fragment.
            this.widget.updateFragment(this.imageContainer, indicator.image, "last");
        }
    }

    // Do not call setCommonProps() here. 

    // Set remaining properties.
    return webui.@THEME@.widget.alert.superclass._setProps.call(this, props);
}

// Inherit base widget properties.
dojo.inherits(webui.@THEME@.widget.alert, webui.@THEME@.widget.widgetBase);

// Override base widget by assigning properties to class prototype.
dojo.lang.extend(webui.@THEME@.widget.alert, {
    // Set private functions.
    fillInTemplate: webui.@THEME@.widget.alert.fillInTemplate,
    getProps: webui.@THEME@.widget.alert.getProps,
    _setProps: webui.@THEME@.widget.alert._setProps,
    notify: webui.@THEME@.widget.alert.event.notification.processEvent,

    // Set defaults.
    event: webui.@THEME@.widget.alert.event,
    widgetType: "alert"
});