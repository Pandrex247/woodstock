/*
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright (c) 2007-2018 Oracle and/or its affiliates. All rights reserved.
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

package com.sun.webui.jsf.example.table.util;

import com.sun.data.provider.FilterCriteria;
import com.sun.data.provider.impl.CompareFilterCriteria;
import com.sun.webui.jsf.component.Table;
import com.sun.webui.jsf.model.Option;

import com.sun.webui.jsf.example.common.MessageUtil;

// This class provides functionality for table filters.
//
// This util class sets filters directly on the TableRowGroup component using 
// FilterCriteria; however, there is also a FilteredTableDataProvider class that
// can used for filtering outside of the table. The table will pick up what ever 
// filter has been applied automatically, for example:
//
// // Some choice of TableDataProvider.
// TableDataProvider provider = new ...
//
// // This wraps and filters an existing TableDataProvider.
// FilteredTableDataProvider filteredProvider = new FilteredTableDataProvider();
// filteredProvider.setTableDataProvider(provider);
//
// // Set FilteredTableDataProvider in the TableRowGroup component.
// tableRowGroup.setSourceData(filteredProvider);
//
// The table component itself has no idea that there is any filtering going on, 
// but the filtering functionality has been encapsulated in the data provider. 
// The developer can then use different FilterCriteria types to apply filters,
// for example:
//
// CompareFilterCriteria cfc = new ...
// RegexFilterCriteria rxfc = new ...
// filteredProvider.setFilterCriteria(new FilterCriteria[] { cfc, fxfc });
public class Filter {
    private String customFilter = null; // Custom filter.
    private String basicFilter = null; // Basic filter menu option.
    private String filterText = null; // Filter text.
    private Group group = null; // Group util.

    // Filter menu items.
    protected static final Option[] filterOptions = {
        new Option("FILTER0", MessageUtil.getMessage("table_filterAllItems")),
        new Option("FILTER1", MessageUtil.getMessage("table_filter1")),
        new Option("FILTER2", MessageUtil.getMessage("table_filter2")),
    };

    // Default constructor.
    public Filter(Group group) {
        this.group = group;
    }

    // UI guidelines state that a "Custom Filter" option should be added to the
    // filter menu, used to open the table filter panel. Thus, if the 
    // CUSTOM_FILTER option is selected, Javascript invoked via the onChange
    // event will open the table filter panel.
    //
    // UI guidelines also state that a "Custom Filter Applied" option should be 
    // added to the filter menu, indicating that a custom filter has been 
    // applied. In this scenario, set the selected property of the filter menu 
    // as CUSTOM_FILTER_APPLIED. This selection should persist until another 
    // menu option has been selected.
    //
    // Further, UI guidelines state that the table title should indicate that a 
    // custom filter has been applied. To add this text to the table title, set 
    // the filter property.

    // Basic filter event.
    public void applyBasicFilter() {
        if (basicFilter.equals("FILTER1")) {
            filterText = MessageUtil.getMessage("table_filter1");
        } else if (basicFilter.equals("FILTER2")) {
            filterText = MessageUtil.getMessage("table_filter2");
        } else {
            filterText = null;
        }

        // Clear all filters since we don't have an example here.
        //
        // Note: TableRowGroup ensures pagination is reset per UI guidelines.
        group.getTableRowGroup().setFilterCriteria(null);
    }

    // Custom filter event.
    public void applyCustomFilter() {
        basicFilter = Table.CUSTOM_FILTER_APPLIED; // Set filter menu option.
        filterText = MessageUtil.getMessage("table_filterCustom");

        // Filter rows that do not match custom filter.
        CompareFilterCriteria criteria = new CompareFilterCriteria(
            group.getNames().getFieldKey("last"), customFilter);

        // Note: TableRowGroup ensures pagination is reset per UI guidelines.
        group.getTableRowGroup().setFilterCriteria(
            new FilterCriteria[] {criteria});
    }

    // Get basic filter.
    public String getBasicFilter() {
        // Note: the selected value must be set to restore the default selected
        // value when the embedded filter panel is closed. Further, the selected
        // value should never be set as "Custom Filter...".
        return (basicFilter != null && !basicFilter.equals(Table.CUSTOM_FILTER))
            ? basicFilter : "FILTER0";
    }

    // Set basic filter.
    public void setBasicFilter(String value) {
        basicFilter = value;
    }

    // Get custom filter.
    public String getCustomFilter() {
        return customFilter;
    }

    // Set custom filter.
    public void setCustomFilter(String value) {
        customFilter = value;
    }

    // Get filter menu options.
    public Option[] getFilterOptions() {
        // Get filter options based on the selected filter menu option.
        return Table.getFilterOptions(filterOptions,
            basicFilter == Table.CUSTOM_FILTER_APPLIED);
    }

    // Get filter text.
    public String getFilterText() {
        return filterText;
    }
}
