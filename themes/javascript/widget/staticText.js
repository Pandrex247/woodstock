//<!--
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

dojo.provide("webui.@THEME@.widget.staticText");

dojo.require("dojo.widget.*");
dojo.require("webui.@THEME@.*");
dojo.require("webui.@THEME@.widget.*");

/**
 * This function will be invoked when creating a Dojo widget. Please see
 * webui.@THEME@.widget.staticText.setProps for a list of supported
 * properties.
 *
 * Note: This is considered a private API, do not use.
 */
webui.@THEME@.widget.staticText = function() {
    // Set defaults.
    this.escape = true;
    this.widgetType = "staticText";

    // Register widget.
    dojo.widget.Widget.call(this);

    /**
     * This function is used to generate a template based widget.
     */
    this.fillInTemplate = function() {
        // Set public functions. 
        this.domNode.getProps = function() { return dojo.widget.byId(this.id).getProps(); }
        this.domNode.refresh = function(execute) { return dojo.widget.byId(this.id).refresh(execute); }
        this.domNode.setProps = function(props) { return dojo.widget.byId(this.id).setProps(props); }

        // Set private functions.
        this.setProps = webui.@THEME@.widget.staticText.setProps;
        this.refresh = webui.@THEME@.widget.staticText.refresh.processEvent;
        this.getProps = webui.@THEME@.widget.staticText.getProps;

        // Set properties.
        return this.setProps();
    }
}

/**
 * This function is used to get widget properties. Please see
 * webui.@THEME@.widget.staticText.setProps for a list of supported
 * properties.
 */
webui.@THEME@.widget.staticText.getProps = function() {
    var props = {};

    // Set properties.
    if (this.escape) { props.escape = this.escape; }
    if (this.value) { props.value = this.value; }

    // Add DOM node properties.
    Object.extend(props, webui.@THEME@.widget.common.getCommonProps(this));
    Object.extend(props, webui.@THEME@.widget.common.getCoreProps(this));
    Object.extend(props, webui.@THEME@.widget.common.getJavaScriptProps(this));

    return props;
}

/**
 * This closure is used to process refresh events.
 */
webui.@THEME@.widget.staticText.refresh = {
    /**
     * Event topics for custom AJAX implementations to listen for.
     */
    beginEventTopic: "webui_@THEME@_widget_staticText_refresh_begin",
    endEventTopic: "webui_@THEME@_widget_staticText_refresh_end",
 
    /**
     * Process refresh event.
     *
     * @param execute Comma separated string containing a list of client ids 
     * against which the execute portion of the request processing lifecycle
     * must be run.
     */
    processEvent: function(execute) {
        // Publish event.
        webui.@THEME@.widget.staticText.refresh.publishBeginEvent({
            id: this.id,
            execute: execute
        });
        return true;
    },

    /**
     * Publish an event for custom AJAX implementations to listen for.
     *
     * @param props Key-Value pairs of properties of the widget.
     */
    publishBeginEvent: function(props) {
        dojo.event.topic.publish(webui.@THEME@.widget.staticText.refresh.beginEventTopic, props);
        return true;
    },

    /**
     * Publish an event for custom AJAX implementations to listen for.
     *
     * @param props Key-Value pairs of properties of the widget.
     */
    publishEndEvent: function(props) {
        dojo.event.topic.publish(webui.@THEME@.widget.staticText.refresh.endEventTopic, props);
        return true;
    }
}

/**
 * This function is used to set widget properties with the
 * following Object literals.
 *
 * <ul>
 *  <li>className</li>
 *  <li>dir</li>
 *  <li>escape</li>
 *  <li>id</li>
 *  <li>lang</li>
 *  <li>onClick</li>
 *  <li>onDblClick</li>
 *  <li>onMouseDown</li>
 *  <li>onMouseOut</li>
 *  <li>onMouseOver</li>
 *  <li>onMouseUp</li>
 *  <li>onMouseMove</li>
 *  <li>style</li>
 *  <li>title</li>
 *  <li>value</li>
 *  <li>visible</li>
 * </ul>
 *
 * @param props Key-Value pairs of properties.
 */
webui.@THEME@.widget.staticText.setProps = function(props) {
    // Save properties for later updates.
    if (props != null) {
        webui.@THEME@.widget.common.extend(this, props);
    } else {
        props = this.getProps(); // Widget is being initialized.
    }

    // Set DOM node properties.
    webui.@THEME@.widget.common.setCoreProps(this.domNode, props);
    webui.@THEME@.widget.common.setCommonProps(this.domNode, props);
    webui.@THEME@.widget.common.setJavaScriptProps(this.domNode, props);
        
    // Set text value.
    if (props.value) {
        this.domNode.innerHTML = ""; // Cannot be null on IE.
        webui.@THEME@.widget.common.addFragment(this.domNode,
            (new Boolean(this.escape).valueOf() == true)
                ? dojo.string.escape("html", props.value) // Default.
                : props.value);
    }
    return true;
}

dojo.inherits(webui.@THEME@.widget.staticText, dojo.widget.HtmlWidget);

//-->
