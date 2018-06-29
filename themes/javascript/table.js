/*
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2018 Oracle and/or its affiliates. All rights reserved.
 *
 * The contents of this file are subject to the terms of either the GNU
 * General Public License Version 2 only ("GPL") or the Common Development
 * and Distribution License("CDDL") (collectively, the "License").  You
 * may not use this file except in compliance with the License.  You can
 * obtain a copy of the License at
 * https://oss.oracle.com/licenses/CDDL+GPL-1.1
 * or LICENSE.txt.  See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * When distributing the software, include this License Header Notice in each
 * file and include the License file at LICENSE.txt.
 *
 * GPL Classpath Exception:
 * Oracle designates this particular file as subject to the "Classpath"
 * exception as provided by Oracle in the GPL Version 2 section of the License
 * file that accompanied this code.
 *
 * Modifications:
 * If applicable, add the following below the License Header, with the fields
 * enclosed by brackets [] replaced by your own identifying information:
 * "Portions Copyright [year] [name of copyright owner]"
 *
 * Contributor(s):
 * If you wish your version of this file to be governed by only the CDDL or
 * only the GPL Version 2, indicate your decision by adding "[Contributor]
 * elects to include this software in this distribution under the [CDDL or GPL
 * Version 2] license."  If you don't indicate a single choice of license, a
 * recipient has the option to distribute your version of this file under
 * either the CDDL, the GPL Version 2 or to extend the choice of license to
 * its licensees as provided above.  However, if you add GPL Version 2 code
 * and therefore, elected the GPL Version 2 license, then the option applies
 * only if the new code is made subject to such option by the copyright
 * holder.
 */


// This Javascript file should be included in any page that uses the table tag.
// Once the table is rendered, you will be able to invoke functions directly on 
// the HTML element. For example:
//
// var table = document.getElementById("form1:table1");
// var count = table.getAllSelectedRowsCount();
//
// Note: It is assumed that formElements.js has been included in the page. In
// addition, all given HTML element IDs are assumed to be the outter most tag
// enclosing the component.

dojo.provide("webui.@THEME@.table");

dojo.require("webui.@THEME@.common");
dojo.require("webui.@THEME@.formElements");

/**
 * Define webui.@THEME@.table name space.
 */
webui.@THEME@.table = {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Public functions
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * This function is used to confirm the number of selected components (i.e., 
     * checkboxes or radiobuttons used to de/select rows of the table), affected
     * by a delete action. This functionality requires the selectId property of
     * the tableColumn component and hiddenSelectedRows property of the
     * tableRowGroup component to be set.
     *
     * If selections are hidden from view, the confirmation message indicates the
     * number of selections not displayed in addition to the total number of
     * selections. If selections are not hidden, the confirmation message indicates
     * only the total selections.
     *
     * @return A value of true if the user clicks the "OK" button, or false if the 
     * user clicks the "Cancel" button.
     */
    confirmDeleteSelectedRows: function() {
        return this.confirmSelectedRows(this.deleteSelectionsMsg);
    },

    /**
     * This function is used to confirm the number of selected components (i.e., 
     * checkboxes or radiobuttons used to de/select rows of the table), affected by
     * an action such as edit, archive, etc. This functionality requires the 
     * selectId property of the tableColumn component and hiddenSelectedRows
     * property of the tableRowGroup component to be set.
     * 
     * If selections are hidden from view, the confirmation message indicates the
     * number of selections not displayed in addition to the total number of
     * selections. If selections are not hidden, the confirmation message indicates
     * only the total selections.
     *
     * @param message The confirmation message (e.g., Archive all selections?).
     * @return A value of true if the user clicks the "OK" button, or false if the 
     * user clicks the "Cancel" button.
     */
    confirmSelectedRows: function(message) {
        // Get total selections message.
        var totalSelections = this.getAllSelectedRowsCount();
        var totalSelectionsArray = this.totalSelectionsMsg.split("{0}");
        var totalSelectionsMsg = totalSelectionsArray[0] + totalSelections;

        // Append hidden selections message.
        var hiddenSelections = this.getAllHiddenSelectedRowsCount();
        if (hiddenSelections > 0) {
            // Get hidden selections message.
            var hiddenSelectionsArray = this.hiddenSelectionsMsg.split("{0}");
            var hiddenSelectionsMsg = hiddenSelectionsArray[0] + hiddenSelections;

            totalSelectionsMsg = hiddenSelectionsMsg + totalSelectionsMsg;
        }
        return (message != null)
            ? confirm(totalSelectionsMsg + message)
            : confirm(totalSelectionsMsg);
    },

    /**
     * This function is used to toggle the filter panel from the filter menu. This
     * functionality requires the filterId of the table component to be set. In 
     * addition, the selected value must be set as well to restore the default
     * selected value when the embedded filter panel is closed.
     *
     * If the "Custom Filter" option has been selected, the table filter panel is 
     * toggled. In this scenario, false is returned indicating the onChange event,
     * generated by the table filter menu, should not be allowed to continue.
     * 
     * If the "Custom Filter Applied" option has been selected, no action is taken.
     * Instead, the is selected filter menu is reverted back to the "Custom Filter" 
     * selection. In this scenario, false is also returned indicating the onChange 
     * event, generated by the table filter menu, should not be allowed to continue.
     *
     * For all other selections, true is returned indicating the onChange event, 
     * generated by the table filter menu, should be allowed to continue.
     *
     * @return true if successful; otherwise, false
     */
    filterMenuChanged: function() {
        // Validate panel IDs.
        if (this.panelToggleIds == null || this.panelToggleIds.length == 0) {
            return false;
        }

        // Get filter menu.
        var menu = webui.@THEME@.dropDown.getSelectElement(
            this.panelToggleIds[this.FILTER]);
        if (menu == null) {
            return true;
        }

        // Test if table filter panel should be opened.
        if (menu.options[menu.selectedIndex].value == this.customFilterOptionValue) {
            this.toggleFilterPanel();
            return false;
        } else if (menu.options[menu.selectedIndex].
                value == this.customFilterAppliedOptionValue) {
            // Set selected option.
            menu.selectedIndex = 0;
            for (var i = 0; i < menu.options.length; i++) {
                if (menu.options[i].value == this.customFilterOptionValue) {
                    menu.options[i].selected = true;
                    break;
                }
            }
            return false;
        }
        return true;
    },

    /**
     * This function is used to get the number of selected components in all row groups
     * displayed in the table (i.e., checkboxes or radiobuttons used to de/select 
     * rows of the table). This functionality requires the selectId property of the
     * tableColumn component and hiddenSelectedRows property of the table
     * component to be set.
     *
     * @return The number of components selected in the current page.
     */
    getAllSelectedRowsCount: function() {
        return this.getAllHiddenSelectedRowsCount() +
            this.getAllRenderedSelectedRowsCount();
    },

    /**
     * This function is used to get the number of selected components, in all row groups
     * displayed in the table (i.e., checkboxes or radiobuttons used to de/select
     * rows of the table), currently hidden from view. This functionality requires 
     * the selectId property of the tableColumn component and hiddenSelectedRows
     * property of the table component to be set.
     *
     * @return The number of selected components hidden from view.
     */
    getAllHiddenSelectedRowsCount: function() {
        var count = 0;

        // Validate group IDs.
        if (this.groupIds == null || this.groupIds.length == 0) {
            return count;
        }

        // For each group, get the row and select id.
        for (var i = 0; i < this.groupIds.length; i++) {
            count = count + this.getGroupHiddenSelectedRowsCount(this.groupIds[i]);
        }
        return count;
    },

    /**
     * This function is used to get the number of selected components, in all row groups
     * displayed in the table (i.e., checkboxes or radiobuttons used to de/select
     * rows of the table), currently rendered. This functionality requires 
     * the selectId property of the tableColumn component to be set.
     *
     * @return The number of selected components hidden from view.
     */
    getAllRenderedSelectedRowsCount: function() {
        var count = 0;

        // Validate group IDs.
        if (this.groupIds == null || this.groupIds.length == 0) {
            return count;
        }

        // For each group, get the row and select id.
        for (var i = 0; i < this.groupIds.length; i++) {
            count = count + this.getGroupRenderedSelectedRowsCount(this.groupIds[i]);
        }
        return count;
    },

    /**
     * This function is used to initialize all rows displayed in the table when the
     * state of selected components change (i.e., checkboxes or radiobuttons used to
     * de/select rows of the table). This functionality requires the selectId
     * property of the tableColumn component to be set.
     *
     * @return true if successful; otherwise, false.
     */
    initAllRows: function() {
        // Validate groupIDs.
        if (this.groupIds == null || this.groupIds.length == 0) {
            return false;
        }

        // For each group, get the row and select id.
        for (var i = 0; i < this.groupIds.length; i++) {
            this.initGroupRows(this.groupIds[i]);
        }
        return true;
    },

    /**
     * This function is used to toggle the filter panel open or closed. This
     * functionality requires the filterId of the table component to be set. In 
     * addition, the selected value must be set as well to restore the default
     * selected value when the embedded filter panel is closed.
     *
     * @return true if successful; otherwise, false
     */
    toggleFilterPanel: function() {
        // Validate panel IDs.
        if (this.panelIds == null || this.panelIds.length == 0) {
            return false;
        }

        // Toggle filter panel.
        this.togglePanel(this.panelIds[this.FILTER],
        this.panelFocusIds[this.FILTER], this.panelToggleIds[this.FILTER]);
        return this.resetFilterMenu(this.panelToggleIds[this.FILTER]); // Reset filter menu.
    },

    /**
     * This function is used to toggle the preferences panel open or closed. This
     * functionality requires the filterId of the table component to be set.
     *
     * @return true if successful; otherwise, false
     */
    togglePreferencesPanel: function() {
        // Validate panel IDs.
        if (this.panelIds == null || this.panelIds.length == 0) {
            return false;
        }

        // Toggle preferences panel.
        this.togglePanel(this.panelIds[this.PREFERENCES],
        this.panelFocusIds[this.PREFERENCES], this.panelToggleIds[this.PREFERENCES]);
        return this.resetFilterMenu(this.panelToggleIds[this.FILTER]); // Reset filter menu.
    },

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Private functions
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * This function is used to initialize HTML element properties with the
     * following Object literals.
     *
     * <ul>
     *  <li>id: The HTML element ID for the component.</li>
     * </ul>
     * Panel Properties
     * <ul>
     *  <li>panelIds: An array of embedded panel IDs.</li>
     *  <li>panelFocusIds: An array of IDs used to set focus for open panels.</li>
     *  <li>panelToggleIds: An array of IDs used to toggle embedded panels.</li>
     *  <li>panelToggleIconsOpen: An array of toggle icons for open panels.</li>
     *  <li>panelToggleIconsClose: An array of toggle icons for closed panels.</li>
     * </ul>
     * Filter Properties
     * <ul>
     *  <li>basicFilterStyleClass: The style class for basic or no filters.</li>
     *  <li>customFilterStyleClass: The style class for custom filters.</li>
     *  <li>customFilterOptionValue: The custom filter menu option value.</li>
     *  <li>customFilterAppliedOptionValue: The custom filter applied menu option value.</li>
     * </ul>
     * Sort Panel Properties
     * <ul>
     *  <li>sortColumnMenuIds: An array of HTML element IDs for sort column menu components.</li>
     *  <li>sortOrderMenuIds: An array of HTML element IDs for sort order menu components.</li>
     *  <li>sortOrderToolTips: An array of tool tips used for sort order menus.</li>
     *  <li>sortOrderToolTipsAscending: An array of ascending tool tips used for sort order menus.</li>
     *  <li>sortOrderToolTipsDescending: An array of descending tool tips used for sort order menus.</li>
     *  <li>duplicateSelectionMsg: The message displayed for duplicate menu selections.</li>
     *  <li>missingSelectionMsg: The message displayed for missing menu selections.</li>
     *  <li>selectSortMenuOptionValue: The sort menu option value for the select column.</li>
     *  <li>hiddenSelectedRows: Flag indicating that selected rows might be currently hidden from view.</li>
     *  <li>paginated: Flag indicating table is in pagination mode.</li>
     * </ul>
     * Group Properties
     * <ul>
     *  <li>selectRowStylClass: The style class for selected rows.</li>
     *  <li>selectIds: An arrary of component IDs used to select rows of the table.</li>
     *  <li>groupIds: An array of TableRowGroup IDs rendered for the table.</li>
     *  <li>rowIds: An array of row IDs for rendered for each TableRowGroup.</li>
     *  <li>hiddenSelectedRowCounts: An array of selected row counts hidden from view.</li>
     *  <li>hiddenSelectionsMsg: The hidden selections message for confirm dialog.</li>
     *  <li>totalSelectionsMsg: The total selections message for confirm dialog.</li>
     *  <li>deleteSelectionsMsg: The delete selections message for confirm dialog.</li>
     * </ul>
     * Group Panel Properties
     * <ul>
     *  <li>columnFooterId: ID for column footer.</li>
     *  <li>columnHeaderId: ID for column header.</li>
     *  <li>tableColumnFooterId: ID for table column footer.</li>
     *  <li>groupFooterId: ID for group footer.</li>
     *  <li>groupPanelToggleButtonId: ID for group panel toggle button.</li>
     *  <li>groupPanelToggleButtonToolTipOpen: tool tip for open row group.</li>
     *  <li>groupPanelToggleButtonToolTipClose: tool tip for closed row group.</li>
     *  <li>groupPanelToggleIconOpen: The toggle icon for open row group.</li>
     *  <li>groupPanelToggleIconClose: The toggle icon for closed row group.</li>
     *  <li>warningIconId: ID for warning icon.</li>
     *  <li>warningIconOpen: The warning icon for open row group.</li>
     *  <li>warningIconClosed: The warning icon for closed row group.</li>
     *  <li>warningIconToolTipOpen: The warning icon tool tip for open row group.</li>
     *  <li>warningIconToolTipClose: The warning icon tool tip for closed row group.</li>
     *  <li>collapsedHiddenFieldId ID: for collapsed hidden field.</li>
     *  <li>selectMultipleToggleButtonId ID: for select multiple toggle button.</li>
     *  <li>selectMultipleToggleButtonToolTip: The select multiple toggle button tool tip.</li>
     *  <li>selectMultipleToggleButtonToolTipSelected: The select multiple toggle button tool tip when selected.</li>
     * </ul>
     *
     * Note: This is considered a private API, do not use.
     *
     * @param props Key-Value pairs of properties.
     */
    init: function(props) {
        if (props == null || props.id == null) {
            return false;
        }
        var domNode = document.getElementById(props.id);
        if (domNode == null) {
            return false;
        }

        // Set given properties on domNode.
        Object.extend(domNode, props);

        // Misc properties.
        domNode.SEPARATOR = ":";   // NamingContainer separator.

        // Panel toggle keys.
        domNode.SORT        = 0;
        domNode.PREFERENCES = 1;
        domNode.FILTER      = 2;

        // Sort keys.
        domNode.PRIMARY   = 0;
        domNode.SECONDARY = 1;
        domNode.TERTIARY  = 2;

        // Replace extra backslashes, JSON escapes new lines (e.g., \\n).
	domNode.hiddenSelectionsMsg = props.hiddenSelectionsMsg.replace(/\\n/g, "\n");
        domNode.totalSelectionsMsg = props.totalSelectionsMsg.replace(/\\n/g, "\n");
	domNode.missingSelectionMsg = props.missingSelectionMsg.replace(/\\n/g, "\n");
	domNode.duplicateSelectionMsg = props.duplicateSelectionMsg.replace(/\\n/g, "\n");
        domNode.deleteSelectionsMsg = props.deleteSelectionsMsg.replace(/\\n/g, "\n");

        // Private functions.
        domNode.initSortOrderMenu = webui.@THEME@.table.initSortOrderMenu;
        domNode.initSortOrderMenuToolTip = webui.@THEME@.table.initSortOrderMenuToolTip;
        domNode.resetFilterMenu = webui.@THEME@.table.resetFilterMenu;
        domNode.togglePanel = webui.@THEME@.table.togglePanel;

        // Public functions.
        domNode.confirmDeleteSelectedRows = webui.@THEME@.table.confirmDeleteSelectedRows;
        domNode.confirmSelectedRows = webui.@THEME@.table.confirmSelectedRows;
        domNode.filterMenuChanged = webui.@THEME@.table.filterMenuChanged;
        domNode.getAllSelectedRowsCount = webui.@THEME@.table.getAllSelectedRowsCount;
        domNode.getAllHiddenSelectedRowsCount = webui.@THEME@.table.getAllHiddenSelectedRowsCount;
        domNode.getAllRenderedSelectedRowsCount = webui.@THEME@.table.getAllRenderedSelectedRowsCount;
        domNode.getGroupSelectedRowsCount = webui.@THEME@.table.getGroupSelectedRowsCount;
        domNode.getGroupHiddenSelectedRowsCount = webui.@THEME@.table.getGroupHiddenSelectedRowsCount;
        domNode.getGroupRenderedSelectedRowsCount = webui.@THEME@.table.getGroupRenderedSelectedRowsCount;
        domNode.initAllRows = webui.@THEME@.table.initAllRows;
        domNode.initGroupRows = webui.@THEME@.table.initGroupRows;
        domNode.initPrimarySortOrderMenu = webui.@THEME@.table.initPrimarySortOrderMenu;
        domNode.initPrimarySortOrderMenuToolTip = webui.@THEME@.table.initPrimarySortOrderMenuToolTip;
        domNode.initSecondarySortOrderMenu = webui.@THEME@.table.initSecondarySortOrderMenu;
        domNode.initSecondarySortOrderMenuToolTip = webui.@THEME@.table.initSecondarySortOrderMenuToolTip;
        domNode.initSortColumnMenus = webui.@THEME@.table.initSortColumnMenus;
        domNode.initSortOrderMenus = webui.@THEME@.table.initSortOrderMenus;
        domNode.initTertiarySortOrderMenu = webui.@THEME@.table.initTertiarySortOrderMenu;
        domNode.initTertiarySortOrderMenuToolTip = webui.@THEME@.table.initTertiarySortOrderMenuToolTip;
        domNode.selectAllRows = webui.@THEME@.table.selectAllRows;
        domNode.selectGroupRows = webui.@THEME@.table.selectGroupRows;
        domNode.toggleSortPanel = webui.@THEME@.table.toggleSortPanel;
        domNode.toggleFilterPanel = webui.@THEME@.table.toggleFilterPanel;
        domNode.togglePreferencesPanel = webui.@THEME@.table.togglePreferencesPanel;
        domNode.toggleGroupPanel = webui.@THEME@.table.toggleGroupPanel;
        domNode.validateSortPanel = webui.@THEME@.table.validateSortPanel;
    },

    /**
     * This function is used to get the number of selected components for the given row 
     * group (i.e., checkboxes or radiobuttons used to de/select rows of the table).
     * This functionality requires the selectId property of the tableColumn component
     * and the hiddenSelectedRows property of the table component to be set.
     *
     * Note: This is considered a private API, do not use.
     *
     * @param groupId The HTML element ID for the tableRowGroup component.
     * @return The number of components selected in the current page.
     */
    getGroupSelectedRowsCount: function(groupId) {
        return this.getGroupHiddenSelectedRowsCount(groupId) + 
            this.getGroupRenderedSelectedRowsCount(groupId);
    },

    /**
     * This function is used to get the number of selected components, for the given row 
     * group (i.e., checkboxes or radiobuttons used to de/select rows of the table),
     * currently hidden from view. This functionality requires the selectId property
     * of the tableColumn component and hiddenSelectedRows property of the table
     * component to be set.
     *
     * Note: This is considered a private API, do not use.
     *
     * @param groupId The HTML element ID for the tableRowGroup component.
     * @return The number of selected components hidden from view.
     */
    getGroupHiddenSelectedRowsCount: function(groupId) {
        var count = 0;

        // Validate group IDs.
        if (this.groupIds == null || this.groupIds.length == 0
                || groupId == null) {
            return count;
        }

        // Find the given group Id in the groupIds array.
        for (var i = 0; i < this.groupIds.length; i++) {
            // Get selectId and rowIds array associated with groupId.
            if (groupId == this.groupIds[i]) {
                count = this.hiddenSelectedRowCounts[i];
                break;
            }
        }
        return count;
    },

    /**
     * This function is used to get the number of selected components, for the given row 
     * group (i.e., checkboxes or radiobuttons used to de/select rows of the table),
     * currently rendered. This functionality requires the selectId property of the
     * tableColumn component to be set.
     *
     * Note: This is considered a private API, do not use.
     *
     * @param groupId The HTML element ID for the tableRowGroup component.
     * @return The number of components selected in the current page.
     */
    getGroupRenderedSelectedRowsCount: function(groupId) {
        var count = 0;

        // Validate group IDs.
        if (this.groupIds == null || this.groupIds.length == 0
                || groupId == null) {
            return count;
        }

        // Get selectId and rowIds array associated with groupId.
        var selectId = null;
        var rowIds = null;
        for (var i = 0; i < this.groupIds.length; i++) {
            if (groupId == this.groupIds[i]) {
                selectId = this.selectIds[i];
                rowIds = this.rowIds[i];
                break;
            }
        }

        // If selectId or rowIds could not be found, do not continue.
        if (selectId == null || rowIds == null) {
            return false;
        }

        // Update the select component for each row.
        for (var k = 0; k < rowIds.length; k++) {
            var select = document.getElementById(
                this.groupIds[i] + this.SEPARATOR + rowIds[k] + 
                this.SEPARATOR + selectId);
            if (select != null && select.checked) {
                count++;
            }
        }
        return count;
    },

    /**
     * This function is used to initialize rows for the given groupwhen the state
     * of selected components change (i.e., checkboxes or radiobuttons used to
     * de/select rows of the table). This functionality requires the selectId
     * property of the tableColumn component to be set.
     *
     * Note: This is considered a private API, do not use.
     *
     * @param groupId The HTML element ID for the tableRowGroup component.
     * @return true if successful; otherwise, false.
     */
    initGroupRows: function(groupId) {
        // Validate groupIDs.
        if (this.groupIds == null || this.groupIds.length == 0
                || groupId == null) {
            return false;
        }

        // Get selectId and rowIds array associated with groupId.
        var selectId = null;
        var rowIds = null;
        for (var i = 0; i < this.groupIds.length; i++) {
            if (groupId == this.groupIds[i]) {
                selectId = this.selectIds[i];
                rowIds = this.rowIds[i];
                break;
            }
        }

        // If selectId or rowIds could not be found, do not continue.
        if (selectId == null || rowIds == null) {
            return false;
        }

        // Update the select component for each row.
        var checked = true; // Checked state of multiple select button.
        var selected = false; // At least one component is selected.
        for (var k = 0; k < rowIds.length; k++) {
            var select = document.getElementById(
                this.groupIds[i] + this.SEPARATOR + rowIds[k] + 
                this.SEPARATOR + selectId);
            if (select == null) {
                continue;
            }

            // Set row style class.
            var row = document.getElementById(this.groupIds[i] + 
                this.SEPARATOR + rowIds[k]);
            if (select.checked == true) {
                webui.@THEME@.common.addStyleClass(row, 
                    this.selectRowStyleClass);
                selected = true;
            } else {
                webui.@THEME@.common.stripStyleClass(row, 
                    this.selectRowStyleClass);
                checked = false;
            }
        }

        // Set multiple select button state.
        var checkbox = document.getElementById(groupId + this.SEPARATOR + 
            this.selectMultipleToggleButtonId);
        if (checkbox != null) {
            checkbox.checked = checked;
            if (checked) {    
                checkbox.title = this.selectMultipleToggleButtonToolTipSelected;
            } else {
                checkbox.title = this.selectMultipleToggleButtonToolTip;
            }
        }

        // Get flag indicating groupis collapsed.
        var prefix = groupId + this.SEPARATOR;
        var collapsed = !webui.@THEME@.common.isVisible(prefix + rowIds[0]);

        // Set next warning image.
        var image = document.getElementById(prefix + this.warningIconId);
        if (image != null) {
            // Don't show icon when multiple select is checked.
            if (collapsed && selected && !checked) {
                image.src = this.warningIconClose;
                image.title = this.warningIconToolTipClose;
            } else {
                image.src = this.warningIconOpen;
                image.title = this.warningIconToolTipOpen;
            }
        }
        return true;
    },

    /**
     * This function is used to initialize the primary sort order menus used in the 
     * table sort panel.
     *
     * Note: This is considered a private API, do not use.
     *
     * @return true if successful; otherwise, false
     */
    initPrimarySortOrderMenu: function() {
        return this.initSortOrderMenu(this.sortColumnMenuIds[this.PRIMARY], 
            this.sortOrderMenuIds[this.PRIMARY]);
    },  

    /**
     * This function is used to initialize the primary sort order menu tool tips 
     * used in the table sort panel.
     *
     * Note: This is considered a private API, do not use.
     *
     * @return true if successful; otherwise, false
     */
    initPrimarySortOrderMenuToolTip: function() {
        // Get sort order menu.
        var sortOrderMenu = webui.@THEME@.dropDown.getSelectElement(
            this.sortOrderMenuIds[this.PRIMARY]);
        if (sortOrderMenu != null) {
            // IE hack so disabled option is not selected -- bugtraq #6269683.
            if (sortOrderMenu.options[sortOrderMenu.selectedIndex].disabled == true) {
                sortOrderMenu.selectedIndex = 0;
            }
        }
        return this.initSortOrderMenuToolTip(this.sortColumnMenuIds[this.PRIMARY], 
            this.sortOrderMenuIds[this.PRIMARY]);
    },

    /**
     * This function is used to initialize the secondary sort order menus used in the 
     * table sort panel.
     *
     * Note: This is considered a private API, do not use.
     *
     * @return true if successful; otherwise, false
     */
    initSecondarySortOrderMenu: function() {
        return this.initSortOrderMenu(this.sortColumnMenuIds[this.SECONDARY], 
            this.sortOrderMenuIds[this.SECONDARY]);
    },

    /**
     * This function is used to initialize the secondary sort order menu tool tips
     * used in the table sort panel.
     *
     * Note: This is considered a private API, do not use.
     *
     * @return true if successful; otherwise, false
     */
    initSecondarySortOrderMenuToolTip: function() {
        // Get sort order menu.
        var sortOrderMenu = webui.@THEME@.dropDown.getSelectElement(
            this.sortOrderMenuIds[this.SECONDARY]);
        if (sortOrderMenu != null) {
            // IE hack so disabled option is not selected -- bugtraq #6269683.
            if (sortOrderMenu.options[sortOrderMenu.selectedIndex].disabled == true) {
                sortOrderMenu.selectedIndex = 0;
            }
        }
        return this.initSortOrderMenuToolTip(this.sortColumnMenuIds[this.SECONDARY], 
            this.sortOrderMenuIds[this.SECONDARY]);
    },

    /**
     * This function is used to initialize the primary, secondary, and tertiary 
     * sort column menus used in the table sort panel.
     *
     * Note: This is considered a private API, do not use.
     *
     * @return true if successful; otherwise, false
     */
    initSortColumnMenus: function() {
        // Validate sort column menu IDs.
        if (this.sortColumnMenuIds == null || this.sortColumnMenuIds.length == 0) {
            return false;
        }

        // Set initial selected option for all sort column menus.
        for (var i = 0; i < this.sortColumnMenuIds.length; i++) {
            // Get sort column menu.
            var sortColumnMenu = webui.@THEME@.dropDown.getSelectElement(
                this.sortColumnMenuIds[i]);
            if (sortColumnMenu == null) {
                continue;
            }

            // Set default selected value.
            sortColumnMenu.selectedIndex = 0;

            // Set selected option.
            for (var k = 0; k < sortColumnMenu.options.length; k++) {
                if (sortColumnMenu.options[k].defaultSelected == true) {
                    sortColumnMenu.options[k].selected = true;
                    break;
                }
            }
            // Ensure hidden filed values are updated.
            webui.@THEME@.dropDown.changed(this.sortColumnMenuIds[i]);
        }
        return true;
    },

    /**
     * This function is used to initialize the primary, secondary, and tertiary 
     * sort order menus used in the table sort panel.
     *
     * Note: This is considered a private API, do not use.
     *
     * @return true if successful; otherwise, false
     */
    initSortOrderMenus: function() {
        // Validate sort order menu IDs.
        if (this.sortOrderMenuIds == null || this.sortOrderMenuIds.length == 0) {
            return false;
        }

        // Set initial selected option for all sort column menus.
        for (var i = 0; i < this.sortOrderMenuIds.length; i++) {
            // Get sort order menu.
            var sortOrderMenu = webui.@THEME@.dropDown.getSelectElement(
                this.sortOrderMenuIds[i]);
            if (sortOrderMenu == null) {
                continue;
            }

            // Set default selected value.
            sortOrderMenu.selectedIndex = 0;

            // Get sort column menu.
            var sortColumnMenu = webui.@THEME@.dropDown.getSelectElement(
                this.sortColumnMenuIds[i]);
            if (sortColumnMenu != null) {
                // If the table is paginated and there are no hidden selected rows, the select
                // column cannot be sorted descending.
                if (sortColumnMenu.options[sortColumnMenu.selectedIndex].
                        value == this.selectSortMenuOptionValue
                        && !this.hiddenSelectedRows && this.paginated) {
                    sortOrderMenu.options[1].disabled = true;
                } else {
                    sortOrderMenu.options[1].disabled = false;
                }
            }

            // Set selected option.
            for (var k = 0; k < sortOrderMenu.options.length; k++) {
                if (sortOrderMenu.options[k].defaultSelected == true) {
                    sortOrderMenu.options[k].selected = true;
                    break;
                }
            }
            // Ensure hidden filed values and styles are updated.
            webui.@THEME@.dropDown.changed(this.sortOrderMenuIds[i]);

            // Initialize tool tip.
            this.initSortOrderMenuToolTip(this.sortColumnMenuIds[i], this.sortOrderMenuIds[i]);
        }
        return true;
    },

    /**
     * This function is used to initialize sort order menus used in the
     * sort panel. When a sort column menu changes, the given sort order 
     * menu is initialized based on the the selected value of the given
     * sort column menu.
     *
     * Note: This is considered a private API, do not use.
     *
     * @param sortColumnMenuId The HTML element ID for the sort column menu component.
     * @param sortOrderMenuId The HTML element ID for the sort order menu component.
     * @return true if successful; otherwise, false
     */
    initSortOrderMenu: function(sortColumnMenuId, sortOrderMenuId) {
        if (sortColumnMenuId == null || sortOrderMenuId == null) {
            return false;
        }

        // Validate sort column menu IDs.
        if (this.sortColumnMenuIds == null || this.sortColumnMenuIds.length == 0) {
            return false;
        }

        // Validate sort order menu IDs.
        if (this.sortOrderMenuIds == null || this.sortOrderMenuIds.length == 0) {
            return false;
        }

        // Get sort column menu.
        var sortColumnMenu = webui.@THEME@.dropDown.getSelectElement(sortColumnMenuId);
        if (sortColumnMenu == null) {
            return false;
        }

        // Get sort order menu.
        var sortOrderMenu = webui.@THEME@.dropDown.getSelectElement(sortOrderMenuId);
        if (sortOrderMenu == null) {
            return false;
        }

        // Reset selected option.
        sortOrderMenu.selectedIndex = 0; // Default ascending.

        // Get sort column menu selected index.            
        var selectedIndex = (sortColumnMenu.selectedIndex > -1)
            ? sortColumnMenu.selectedIndex : 0; // Default to first option.

        // If the table is paginated and there are no hidden selected rows, the select
        // column cannot be sorted descending.
        if (sortColumnMenu.options[selectedIndex].value == this.selectSortMenuOptionValue
                && !this.hiddenSelectedRows && this.paginated) {
            sortOrderMenu.options[1].disabled = true;
        } else {
            sortOrderMenu.options[1].disabled = false;
        }

        // Attempt to match the selected index of the given sort column menu with the
        // default selected value from either sort column menu. If a match is found, the 
        // default selected value of the associated sort order menu is retrieved. This
        // default selected value is set as the current selection of the given sort 
        // order menu.
        for (var i = 0; i < this.sortColumnMenuIds.length; i++) {
            // Get the current sort column menu to test the default selected value.
            var currentSortColumnMenu = webui.@THEME@.dropDown.getSelectElement(
                this.sortColumnMenuIds[i]);
            if (currentSortColumnMenu == null) {
                continue;
            }

            // Find default selected value for the current sort column menu.
            var defaultSelected = null;
            for (var k = 0; k < currentSortColumnMenu.options.length; k++) {
                if (currentSortColumnMenu.options[k].defaultSelected == true) {
                    defaultSelected = currentSortColumnMenu.options[k].value;
                    break;
                }
            }

            // Match default selected value with selected index value.
            if (defaultSelected != null && defaultSelected ==
                    sortColumnMenu.options[selectedIndex].value) {
                // Get current sort order menu to test the default selected value.
                var currentSortOrderMenu = webui.@THEME@.dropDown.getSelectElement(
                    this.sortOrderMenuIds[i]);
                if (currentSortOrderMenu == null) {
                    continue;
                }

                // Find default selected index for the current sort order menu.
                var defaultSelectedIndex = -1;
                for (var k = 0; k < currentSortOrderMenu.options.length; k++) {
                    if (currentSortOrderMenu.options[k].defaultSelected == true) {
                        defaultSelectedIndex = k;
                        break;
                    }
                }

                // Set selected value for given sort order menu.
                if (defaultSelectedIndex > -1) {
                    sortOrderMenu.options[defaultSelectedIndex].selected = true;
                } else {
                    sortOrderMenu.options[0].selected = true; // Default ascending.
                }
                break;
            }
        }
        // Ensure hidden field values and styles are updated.
        webui.@THEME@.dropDown.changed(sortOrderMenuId);

        // Set sort order menu tool tip.
        return this.initSortOrderMenuToolTip(sortColumnMenuId, sortOrderMenuId);
    },

    /**
     * This function is used to initialize sort order menu tool tips used in the 
     * sort panel. When a sort column menu changes, the given sort order 
     * menu tool tip is initialized based on the the selected value of the given
     * sort column menu.
     *
     * Note: This is considered a private API, do not use.
     *
     * @param sortColumnMenuId The HTML element ID for the sort column menu component.
     * @param sortOrderMenuId The HTML element ID for the sort order menu component.
     * @return true if successful; otherwise, false
     */
    initSortOrderMenuToolTip: function(sortColumnMenuId, sortOrderMenuId) {
        if (sortColumnMenuId == null || sortOrderMenuId == null) {
            return false;
        }

        // Get sort column menu.
        var sortColumnMenu = webui.@THEME@.dropDown.getSelectElement(sortColumnMenuId);
        if (sortColumnMenu == null) {
            return false;
        }

        // Get sort order menu.
        var sortOrderMenu = webui.@THEME@.dropDown.getSelectElement(sortOrderMenuId);
        if (sortOrderMenu == null) {
            return false;
        }

        // Get tool tip associated with given sort order menu.
        var toolTip = "";
        if (this.sortOrderToolTips != null && this.sortOrderToolTips.length != 0
                && this.sortOrderMenuIds != null) {
            for (var i = 0; i < this.sortOrderMenuIds.length; i++) {
                // The tool tip is at index zero, after splitting the message.
                if (sortOrderMenuId == this.sortOrderMenuIds[i]) {
                    toolTip = this.sortOrderToolTips[i].split("{0}")[0];
                    break;
                }
            }
        }

        // Get sort column menu selected index.            
        var selectedIndex = (sortColumnMenu.selectedIndex > -1)
            ? sortColumnMenu.selectedIndex : 0; // Default to first option.

        // Set tool tip.
        if (sortOrderMenu.options[sortOrderMenu.selectedIndex].value == "true") {
            sortOrderMenu.title = toolTip + this.sortOrderToolTipsDescending[selectedIndex];
        } else {
            // Default ascending.
            sortOrderMenu.title = toolTip + this.sortOrderToolTipsAscending[selectedIndex];
        }
        return true;
    },

    /**
     * This function is used to initialize the tertiary sort order menus used in the 
     * table sort panel.
     *
     * Note: This is considered a private API, do not use.
     *
     * @return true if successful; otherwise, false
     */
    initTertiarySortOrderMenu: function() {
        return this.initSortOrderMenu(this.sortColumnMenuIds[this.TERTIARY], 
            this.sortOrderMenuIds[this.TERTIARY]);
    },

    /**
     * This function is used to initialize the tertiary sort order menu tool tips
     * used in the table sort panel.
     *
     * Note: This is considered a private API, do not use.
     *
     * @return true if successful; otherwise, false
     */
    initTertiarySortOrderMenuToolTip: function() {
        // Get sort order menu.
        var sortOrderMenu = webui.@THEME@.dropDown.getSelectElement(
            this.sortOrderMenuIds[this.TERTIARY]);
        if (sortOrderMenu != null) {
            // IE hack so disabled option is not selected -- bugtraq #6269683.
            if (sortOrderMenu.options[sortOrderMenu.selectedIndex].disabled == true) {
                sortOrderMenu.selectedIndex = 0;
            }
        }
        return this.initSortOrderMenuToolTip(this.sortColumnMenuIds[this.TERTIARY], 
            this.sortOrderMenuIds[this.TERTIARY]);
    },

    /**
     * This function is used to reset filter drop down menu. This functionality 
     * requires the filterId of the table component to be set. In addition,
     * the selected value must be set as well to restore the default selected
     * value when the embedded filter panel is closed.
     *
     * Note: This is considered a private API, do not use.
     *
     * @param filterId The HTML element ID of the filter menu.
     * @return true if successful; otherwise, false.
     */
    resetFilterMenu: function(filterId) {
        if (filterId == null) {
            return false;
        }

        // Get filter menu.
        var menu = webui.@THEME@.dropDown.getSelectElement(filterId);
        if (menu == null) {
            return true;
        }

        // Get div element associated with the filter panel.
        var div = document.getElementById(this.panelIds[this.FILTER]);
        if (div == null) {
            return false;
        }

        // Set selected style.
        if (webui.@THEME@.common.isVisibleElement(div)) {
            webui.@THEME@.common.stripStyleClass(menu, this.basicFilterStyleClass);
            webui.@THEME@.common.addStyleClass(menu, this.customFilterStyleClass);
        } else {
            // Reset default selected option.
            menu.selectedIndex = 0;
            for (var i = 0; i < menu.options.length; i++) {
                if (menu.options[i].defaultSelected == true) {
                    menu.options[i].selected = true;
                    break;
                }
            }
            webui.@THEME@.common.stripStyleClass(menu, this.customFilterStyleClass);
            webui.@THEME@.common.addStyleClass(menu, this.basicFilterStyleClass);
        }
        return true;
    },

    /**
     * This function is used to set the selected state components in all row groups
     * displayed in the table (i.e., checkboxes or radiobuttons used to de/select
     * rows of the table). This functionality requires the selectId property of
     * the tableColumn component to be set.
     *
     * Note: This is considered a private API, do not use.
     *
     * @param selected Flag indicating components should be selected.
     * @return true if successful; otherwise, false.
     */
    selectAllRows: function(selected) {
        // Validate groupIDs.
        if (this.groupIds == null || this.groupIds.length == 0) {
            return false;
        }

        // For each group, get the row and select id.
        for (var i = 0; i < this.groupIds.length; i++) {
            this.selectGroupRows(this.groupIds[i], selected);
        }
        return true;
    },

    /**
     * This function is used to set the selected state components for the given row group
     * (i.e., checkboxes or radiobuttons used to de/select rows of the table). This 
     * functionality requires the selectId property of the tableColumn component to be
     * set.
     *
     * Note: This is considered a private API, do not use.
     *
     * @param groupId The HTML element ID for the tableRowGroup component.
     * @param selected Flag indicating components should be selected.
     * @return true if successful; otherwise, false.
     */
    selectGroupRows: function(groupId, selected) {
        // Validate groupIDs.
        if (this.groupIds == null || this.groupIds.length == 0
                || groupId == null) {
            return false;
        }

        // Get selectId and rowIds array associated with groupId.
        var selectId = null;
        var rowIds = null;
        for (var i = 0; i < this.groupIds.length; i++) {
            if (groupId == this.groupIds[i]) {
                selectId = this.selectIds[i];
                rowIds = this.rowIds[i];
                break;
            }
        }

        // If selectId or rowIds could not be found, do not continue.
        if (selectId == null || rowIds == null) {
            return false;
        }

        // Update the select component for each row.
        for (var k = 0; k < rowIds.length; k++) {
            var select = document.getElementById(
                this.groupIds[i] + this.SEPARATOR + rowIds[k] + this.SEPARATOR + selectId);
            if (select == null) {
                continue;
            }
            select.checked = new Boolean(selected).valueOf();
        }
        return this.initGroupRows(groupId); // Set row highlighting.
    },

    /**
     * This function is used to toggle row group panels open or closed.
     *
     * Note: This is considered a private API, do not use.
     *
     * @param groupId The HTML element ID for the tableRowGroup component.
     * @return true if successful; otherwise, false.
     */
    toggleGroupPanel: function(groupId) {
        // Validate groupIDs.
        if (this.groupIds == null || this.groupIds.length == 0
                || groupId == null) {
            return false;
        }

        // Get rowIds array associated with groupId.
        var rowIds = null;
        for (var i = 0; i < this.groupIds.length; i++) {
            if (groupId == this.groupIds[i]) {
                rowIds = this.rowIds[i];
                break;
            }
        }

        // If row IDs could not be found, do not continue.
        if (rowIds == null) {
            return false;
        }

        // Get flag indicating group is collapsed.
        var prefix = groupId + this.SEPARATOR;
        var collapsed = !webui.@THEME@.common.isVisible(prefix + rowIds[0]);

        // Get the number of column headers and table column footers for all 
        // TableRowGroup children.
        var columnHeadersCount = 0;
        var tableColumnFootersCount = 0;
        for (var i = 0; i < this.groupIds.length; i++) {
            // Only need to test first nested column header/footer; thus, index 0 is used.        
            var _prefix = this.groupIds[i] + this.SEPARATOR;
            var columnHeaderId = _prefix + this.columnHeaderId + this.SEPARATOR + "0";
            var tableColumnFooterId = _prefix + this.tableColumnFooterId + this.SEPARATOR + "0";
            if (document.getElementById(columnHeaderId) != null) {
                columnHeadersCount++;
            }
            if (document.getElementById(tableColumnFooterId) != null) {
                tableColumnFootersCount++;
            }
        }

        // Toggle nested column footer.
        var rowIndex = 0;
        while (true) {
            var columnFooterId = prefix + this.columnFooterId + 
                this.SEPARATOR + rowIndex++;
            if (document.getElementById(columnFooterId) == null) {
                break;
            }
            webui.@THEME@.common.setVisible(columnFooterId, collapsed);
        }

        // Toggle column header only if multiple column headers are shown.
        if (columnHeadersCount > 1) {
            rowIndex = 0;
            while (true) {
                var columnHeaderId = prefix + this.columnHeaderId + 
                    this.SEPARATOR + rowIndex++;
                if (document.getElementById(columnHeaderId) == null) {
                    break;
                }            
                webui.@THEME@.common.setVisible(columnHeaderId, collapsed);
            }
        }

        // Toggle table column footer only if multiple column footers are shown.
        if (tableColumnFootersCount > 1) {
            rowIndex = 0;
            while (true) {
                var tableColumnFooterId = prefix + this.tableColumnFooterId + 
                    this.SEPARATOR + rowIndex++;
                if (document.getElementById(tableColumnFooterId) == null) {
                    break;
                }
                webui.@THEME@.common.setVisible(tableColumnFooterId, collapsed);
            }
        }

        // Toggle group rows.
        for (var k = 0; k < rowIds.length; k++) {
            var rowId = prefix + rowIds[k];
            webui.@THEME@.common.setVisible(rowId, collapsed);
        }

        // Toggle group footers.
        webui.@THEME@.common.setVisible(prefix + this.groupFooterId, collapsed);

        // Set next toggle button image.
        var groupPanelToggleButtonId = prefix + this.groupPanelToggleButtonId;
        var hyperlink = document.getElementById(groupPanelToggleButtonId);
        var image = webui.@THEME@.hyperlink.getImgElement(groupPanelToggleButtonId);
        if (hyperlink != null && image != null) {
            if (collapsed) {
                image.src = this.groupPanelToggleIconOpen;
                hyperlink.title = this.groupPanelToggleButtonToolTipOpen;
            } else {
                image.src = this.groupPanelToggleIconClose;
                hyperlink.title = this.groupPanelToggleButtonToolTipClose;
            }
        }

        // Set collapsed hidden field.
        var hiddenField = document.getElementById(prefix + this.collapsedHiddenFieldId);
        if (hiddenField != null) {
            hiddenField.value = !collapsed;
        }
        return this.initGroupRows(groupId); // Set next warning image.
    },

    /**
     * This function is used to toggle embedded panels.
     *
     * Note: This is considered a private API, do not use.
     *
     * @param panelId The panel ID to toggle.
     * @param panelFocusIdOpen The ID used to set focus when panel is opened.
     * @param panelFocusIdClose The ID used to set focus when panel is closed.
     * @return true if successful; otherwise, false.
     */
    togglePanel: function(panelId, panelFocusIdOpen, panelFocusIdClose) {
        if (panelId == null) {
            return false;
        }

        // Toggle the given panel, hide all others.
        for (var i = 0; i < this.panelIds.length; i++) {
            // Get div element associated with the panel.
            var div = document.getElementById(this.panelIds[i]);
            if (div == null) {
                continue;
            }

            // Set display value. Alternatively, we could set div.style.display
            // equal to "none" or "block" (i.e., hide/show).
            if (this.panelIds[i] == panelId) {
                // Set focus when panel is toggled -- bugtraq 6316565.
                var focusElement = null;

                if (webui.@THEME@.common.isVisibleElement(div)) {
                    webui.@THEME@.common.setVisibleElement(div, false); // Hide panel.
                    focusElement = document.getElementById(panelFocusIdClose);
                } else {
                    webui.@THEME@.common.setVisibleElement(div, true); // Show panel.
                    focusElement = document.getElementById(panelFocusIdOpen);
                }

                // Set focus.
                if (focusElement != null) {
                    focusElement.focus();
                }
            } else {
                // Panels are hidden by default.
                webui.@THEME@.common.setVisibleElement(div, false);
            }

            // Get image from icon hyperlink component.
            var image = webui.@THEME@.hyperlink.getImgElement(this.panelToggleIds[i]);
            if (image == null) {
                continue; // Filter panel uses a drop down menu.
            }

            // Set image.
            if (webui.@THEME@.common.isVisibleElement(div)) {
                image.src = this.panelToggleIconsOpen[i];
            } else {
                image.src = this.panelToggleIconsClose[i];
            }
        }
        return true;
    },

    /**
     * This function is used to toggle the sort panel open or closed. This
     * functionality requires the filterId of the table component to be set.
     *
     * Note: This is considered a private API, do not use.
     *
     * @return true if successful; otherwise, false
     */
    toggleSortPanel: function() {
        // Validate panel IDs.
        if (this.panelIds == null || this.panelIds.length == 0) {
            return false;
        }

        // Initialize sort column and order menus.
        this.initSortColumnMenus(); 
        this.initSortOrderMenus();

        // Toggle sort panel.
        this.togglePanel(this.panelIds[this.SORT], 
        this.panelFocusIds[this.SORT], this.panelToggleIds[this.SORT]);
        return this.resetFilterMenu(this.panelToggleIds[this.FILTER]); // Reset filter menu.
    },

    /**
     * This function is used to validate sort column menu selections 
     * for the sort panel.
     *
     * Note: This is considered a private API, do not use.
     *
     * @return true if successful; otherwise, false
     */
    validateSortPanel: function() {
        // Validate sort column menu IDs.
        if (this.sortColumnMenuIds == null || this.sortColumnMenuIds.length == 0) {
            return false;
        }

        // Get sort column menus.
        var primarySortColumnMenu = webui.@THEME@.dropDown.getSelectElement(
            this.sortColumnMenuIds[this.PRIMARY]);
        var secondarySortColumnMenu = webui.@THEME@.dropDown.getSelectElement(
            this.sortColumnMenuIds[this.SECONDARY]);
        var tertiarySortColumnMenu = webui.@THEME@.dropDown.getSelectElement(
            this.sortColumnMenuIds[this.TERTIARY]);

        // Test primary and secondary menu selections.
        if (primarySortColumnMenu != null && secondarySortColumnMenu != null) {
            // Test if secondary sort is set, but primary is not.
            if (primarySortColumnMenu.selectedIndex < 1 
                    && secondarySortColumnMenu.selectedIndex > 0) {
                alert(this.missingSelectionMsg);
                return false;
            }
            // If a selection has been made, test for duplicate.
            if (primarySortColumnMenu.selectedIndex > 0
                  && primarySortColumnMenu.selectedIndex == secondarySortColumnMenu.selectedIndex) {
                alert(this.duplicateSelectionMsg);
                return false;
            }
        }

        // Test primary and tertiary menu selections.
        if (primarySortColumnMenu != null && tertiarySortColumnMenu != null) {
            // Test if tertiary sort is set, but primary is not.
            if (primarySortColumnMenu.selectedIndex < 1 
                    && tertiarySortColumnMenu.selectedIndex > 0) {
                alert(this.missingSelectionMsg);
                return false;
            }
            // If a selection has been made, test for duplicate.
            if (primarySortColumnMenu.selectedIndex > 0
                    && primarySortColumnMenu.selectedIndex == tertiarySortColumnMenu.selectedIndex) {
                alert(this.duplicateSelectionMsg);
                return false;
            }
        }

        // Test secondary and tertiary menu selections.
        if (secondarySortColumnMenu != null && tertiarySortColumnMenu != null) {
            // Test if tertiary sort is set, but secondary is not.
            if (secondarySortColumnMenu.selectedIndex < 1 
                    && tertiarySortColumnMenu.selectedIndex > 0) {
                alert(this.missingSelectionMsg);
                return false;
            }
            // If a selection has been made, test for duplicate.
            if (secondarySortColumnMenu.selectedIndex > 0
                    && secondarySortColumnMenu.selectedIndex == tertiarySortColumnMenu.selectedIndex) {
                alert(this.duplicateSelectionMsg);
                return false;
            }
        }
        return true;
    }
}

//-->
