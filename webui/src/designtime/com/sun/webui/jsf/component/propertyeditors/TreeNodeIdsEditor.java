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

package com.sun.webui.jsf.component.propertyeditors;

import com.sun.rave.propertyeditors.SelectOneDomainEditor;
import com.sun.rave.designtime.DesignBean;
import com.sun.rave.designtime.DesignProperty;
import com.sun.rave.propertyeditors.domains.AttachedDomain;
import com.sun.rave.propertyeditors.domains.Element;
import com.sun.webui.jsf.component.TreeNode;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.Stack;
import java.util.TreeSet;
import javax.faces.component.UIComponent;

public class TreeNodeIdsEditor extends SelectOneDomainEditor {
    
    public TreeNodeIdsEditor() {
        super(new TreeNodeIdsDomain());
    }
    
    /**
     * Domain of identifiers of all {@link com.sun.webui.jsf.component.TreeNode} components
     * within the currently selected {@link com.sun.webui.jsf.component.Tree}
     * component. Used to provide an enumeration of values for the <code>selected</code>
     * property. Iterates over all tree nodes in the tree, in document order.
     */
    static class TreeNodeIdsDomain extends AttachedDomain {
        
        public Element[] getElements() {
            // If we have not been attached yet, there is nothing we can do
            // except return an empty list
            DesignProperty designProperty = this.getDesignProperty();
            if (designProperty == null)
                return Element.EMPTY_ARRAY;
            // Construct a list of all tree node descendants
            DesignBean designBean = designProperty.getDesignBean();
            if (designBean == null || designBean.getChildBeanCount() == 0)
                return Element.EMPTY_ARRAY;
            Stack<DesignBean> beanStack = new Stack<DesignBean>();
            List<DesignBean> beanList = new ArrayList<DesignBean>();
            DesignBean[] childBeans = designBean.getChildBeans();
            for (int i = designBean.getChildBeanCount() - 1; i >= 0; i--)
                beanStack.push(childBeans[i]);
            while (!beanStack.isEmpty()) {
                DesignBean bean = beanStack.pop();
                if (bean.getInstance() instanceof TreeNode)
                    beanList.add(bean);
                childBeans = bean.getChildBeans();
                for (int i = bean.getChildBeanCount() - 1; i >= 0; i--)
                    beanStack.push(childBeans[i]);
            }
            // Construct an array of elements from the labels and identifiers of
            // the retained tree node components
            Element elements[] = new Element[beanList.size()];
            for (int i = 0; i < elements.length; i++) {
                DesignBean bean = beanList.get(i);
                TreeNode treeNode = (TreeNode) bean.getInstance();
                String id = treeNode.getId();
                String text = treeNode.getText();
                if (text == null)
                    elements[i] = new Element(id, id);
                else
                    elements[i] = new Element(id, text + " (" + id + ")");
            }
            return elements;
            
        }
    }
    
}
