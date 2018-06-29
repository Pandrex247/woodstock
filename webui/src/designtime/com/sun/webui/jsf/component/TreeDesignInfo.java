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

package com.sun.webui.jsf.component;

import com.sun.data.provider.DataProvider;
import com.sun.rave.designtime.DesignBean;
import com.sun.rave.designtime.DesignContext;
import com.sun.rave.designtime.DesignProperty;
import com.sun.rave.designtime.Result;
import com.sun.webui.jsf.component.util.DesignUtil;
import com.sun.webui.jsf.design.AbstractDesignInfo;

/**
 * Design time behavior for a <code>Tree</code> component.
 * 
 * @author gjmurphy
 * @author Edwin Goei
 */
public class TreeDesignInfo extends AbstractDesignInfo {

    public TreeDesignInfo() {
        super(Tree.class);
    }

    public Result beanCreatedSetup(DesignBean bean) {
        DesignProperty prop;

        DesignProperty textProperty = bean.getProperty("text"); //NOI18N
        textProperty.setValue(bean.getBeanInfo().getBeanDescriptor().getDisplayName());

        DesignContext context = bean.getDesignContext();
        if (context.canCreateBean(TreeNode.class.getName(), bean, null)) {
            DesignBean treeNodeBean = context.createBean(TreeNode.class.getName(), bean, null);
            // Use same DT property state as if user added TreeNode
            treeNodeBean.getDesignInfo().beanCreatedSetup(treeNodeBean);
        }

        return Result.SUCCESS;
    }

    public boolean acceptChild(DesignBean parentBean, DesignBean childBean,
            Class childClass) {
        if (TreeNode.class.equals(childClass))
            return true;
        return false;
    }

    public boolean acceptLink(DesignBean targetBean, DesignBean sourceBean, Class sourceClass) {
        if (DataProvider.class.isAssignableFrom(sourceClass)) {
            if (this.getDefaultBindingProperty(targetBean) != null)
                return true;
        }
        return false;
    }
    
}
