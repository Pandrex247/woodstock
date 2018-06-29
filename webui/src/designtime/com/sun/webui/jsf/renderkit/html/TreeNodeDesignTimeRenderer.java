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

package com.sun.webui.jsf.renderkit.html;

import com.sun.webui.jsf.component.TreeNode;
import com.sun.webui.jsf.component.util.DesignMessageUtil;
import com.sun.webui.jsf.renderkit.html.TreeNodeRenderer;
import java.io.IOException;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.el.ValueBinding;


/**
 * A delegating renderer for {@link com.sun.webui.jsf.component.TreeNode}.
 *
 * @author gjmurphy
 */
public class TreeNodeDesignTimeRenderer extends AbstractDesignTimeRenderer {
    
    protected static String STYLE_CLASS_PROP = "styleClass"; //NOI18N
    
    boolean isTextSet;
    boolean isStyleSet;
    
    public TreeNodeDesignTimeRenderer() {
        super(new TreeNodeRenderer());
    }
    
    public void encodeBegin(FacesContext context, UIComponent component) throws IOException {
        if (TreeNode.class.isAssignableFrom(component.getClass())) {
            ValueBinding valueBinding = component.getValueBinding("text"); //NOI18N
            TreeNode treeNode = (TreeNode) component;
            String text = treeNode.getText();
            if (valueBinding != null && (text == null || text.toString().length() == 0)) {
                Object dummyText = getDummyData(context, valueBinding);
                if (dummyText == null) {
                    treeNode.setText("");
                } else {
                    treeNode.setText(dummyText.toString());
                }
                isTextSet = true;
            } else if (treeNode.getText() == null) {
                treeNode.setText(DesignMessageUtil.getMessage(TreeNodeDesignTimeRenderer.class, "treeNode.label"));
                String styleClass = (String) component.getAttributes().get(STYLE_CLASS_PROP);
                component.getAttributes().put(STYLE_CLASS_PROP, addStyleClass(styleClass, UNINITITIALIZED_STYLE_CLASS));
                isTextSet = true;
                isStyleSet = true;
            }
        }
        super.encodeBegin(context, component);
    }
    
    public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
        super.encodeEnd(context, component);
        if (isTextSet) {
            TreeNode treeNode = (TreeNode) component;
            treeNode.setText(null);
            isTextSet = false;
        }
        if (isStyleSet) {
            String styleClass = (String) component.getAttributes().get(STYLE_CLASS_PROP);
            component.getAttributes().put(STYLE_CLASS_PROP, removeStyleClass(styleClass, UNINITITIALIZED_STYLE_CLASS));
            isStyleSet = false;
        }
    }
}
