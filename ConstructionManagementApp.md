# 建筑施工进度管理应用页面结构

这份文档用于指导当前项目从通用 Issue Tracker 继续升级为面向建筑施工现场的进度管理系统。页面结构围绕专业工程划分展开：

```text
Project 项目
└─ UnitProject 单位工程
   └─ DivisionWork 分部工程
      └─ SubItemWork 分项工程
         ├─ Task / Issue 任务、问题、协调事项
         └─ ProgressRecord 进度填报记录
```

## 1. 产品定位

```text
建筑施工进度管理应用
├─ 管理多个工程项目
├─ 每个项目之间相互独立
├─ 项目创建人就是该项目 admin
├─ 项目下按单位工程、分部工程、分项工程组织施工内容
├─ 通过任务、问题、评论、进度记录跟踪现场执行
└─ Dashboard 汇总项目进度、逾期项和近期活动
```

专业依据：

```text
GB 50300-2013 建筑工程施工质量验收统一标准：
建筑工程施工质量验收划分为单位工程、分部工程、分项工程和检验批。

GB/T 50326-2017 建设工程项目管理规范：
进度管理应覆盖进度计划、实施、检查、调整和相关责任。
```

## 2. 顶层导航

```text
NavBar
├─ Dashboard
│  └─ /dashboard
├─ Projects
│  └─ /projects
└─ Tasks
   └─ /issues
```

说明：

```text
当前代码已有 /issues。
短期内保留 /issues 路由，但 UI 文案逐步改为 Tasks / 施工任务。
后续如果要彻底产品化，再考虑把目录和 API 重命名为 tasks。
```

## 3. Dashboard 页面

路径：

```text
/dashboard
```

页面目标：

```text
让用户一进入系统就能看到自己创建或参与的项目整体进度。
```

页面结构：

```text
Dashboard
├─ Header
│  ├─ 页面标题：施工进度总览
│  └─ 快捷按钮：New Project
│
├─ Summary Metrics
│  ├─ Total Projects
│  ├─ Active Projects
│  ├─ Overdue Works
│  └─ Completed Works
│
├─ Project Progress Overview
│  ├─ 项目名称
│  ├─ 项目状态
│  ├─ 总进度
│  ├─ 计划完成日期
│  └─ 逾期提示
│
├─ Work Status Breakdown
│  ├─ 单位工程状态分布
│  ├─ 分部工程状态分布
│  └─ 分项工程状态分布
│
└─ Recent Activity
   ├─ 最近创建的项目
   ├─ 最近更新的工程节点
   ├─ 最近更新的任务
   └─ 最近评论
```

数据来源：

```text
Project
UnitProject
DivisionWork
SubItemWork
Issue
Comment
```

## 4. Projects 列表页

路径：

```text
/projects
```

页面目标：

```text
展示当前用户可访问的工程项目，并提供创建项目入口。
```

页面结构：

```text
ProjectsPage
├─ Header
│  ├─ 页面标题：Projects
│  └─ Create Project 按钮
│
├─ Filters
│  ├─ Status
│  ├─ Owner
│  └─ Keyword
│
├─ Projects Table
│  ├─ Project Name
│  ├─ Status
│  ├─ Owner
│  ├─ Start Date
│  ├─ Due Date
│  ├─ Progress
│  └─ Actions
│
└─ Empty / Loading / Error states
```

交互：

```text
点击项目行 -> /projects/:projectId
点击 Create Project -> /projects/new
```

权限：

```text
所有已登录用户都可以创建项目。
项目创建人写入 Project.ownerId。
Project.ownerId === session.user.id 的用户就是该项目 admin。
```

## 5. 创建项目页

路径：

```text
/projects/new
```

页面目标：

```text
创建一个新的工程项目，并将当前用户设置为项目 admin。
```

表单字段：

```text
ProjectForm
├─ name
├─ description
├─ status
├─ startDate
└─ dueDate
```

提交逻辑：

```text
POST /api/projects
├─ 校验登录
├─ Zod 校验表单
├─ 创建 Project
├─ ownerId = session.user.id
└─ 成功后跳转 /projects/:projectId
```

## 6. 项目详情页

路径：

```text
/projects/:projectId
```

页面目标：

```text
作为单个工程项目的主工作台，展示项目概况、单位工程、进度统计和近期活动。
```

页面结构：

```text
ProjectDetailPage
├─ Project Header
│  ├─ 项目名称
│  ├─ 项目状态
│  ├─ 项目 admin
│  ├─ 起止日期
│  └─ Edit / Delete actions
│
├─ Project Overview
│  ├─ 总进度
│  ├─ 单位工程数量
│  ├─ 分部工程数量
│  ├─ 分项工程数量
│  ├─ 施工任务数量
│  └─ 逾期节点数量
│
├─ Unit Projects Section
│  ├─ Create Unit Project 按钮
│  ├─ 单位工程列表
│  └─ 点击进入单位工程详情
│
├─ Project Tasks Section
│  ├─ 项目下所有任务
│  ├─ 可按单位工程 / 分部工程 / 分项工程筛选
│  └─ Create Task 按钮
│
└─ Recent Activity Section
   ├─ 工程节点更新
   ├─ 任务状态更新
   ├─ 进度填报
   └─ 评论
```

推荐布局：

```text
桌面端：
├─ 左侧主内容：概览 + 单位工程 + 任务
└─ 右侧窄栏：近期活动 + 项目信息

移动端：
└─ 单列堆叠
```

## 7. 编辑项目页

路径：

```text
/projects/:projectId/edit
```

页面目标：

```text
允许项目 admin 修改项目基础信息。
```

权限：

```text
只有 Project.ownerId === session.user.id 的用户可以编辑。
```

表单字段：

```text
ProjectForm
├─ name
├─ description
├─ status
├─ startDate
└─ dueDate
```

## 8. 单位工程详情页

路径：

```text
/projects/:projectId/unit-projects/:unitProjectId
```

页面目标：

```text
展示某个单位工程的进度和其下分部工程。
```

页面结构：

```text
UnitProjectDetailPage
├─ Unit Project Header
│  ├─ 单位工程名称
│  ├─ 编号
│  ├─ 状态
│  ├─ 计划日期
│  ├─ 实际日期
│  └─ 进度
│
├─ Overview
│  ├─ 分部工程数量
│  ├─ 分项工程数量
│  ├─ 任务数量
│  └─ 逾期项数量
│
├─ Division Works Section
│  ├─ Create Division Work 按钮
│  ├─ 分部工程列表
│  └─ 点击进入分部工程详情
│
└─ Related Tasks
   ├─ 关联任务列表
   └─ Create Task 按钮
```

典型单位工程：

```text
1#住宅楼
2#住宅楼
地下车库
室外道路工程
配套管网工程
```

## 9. 分部工程详情页

路径：

```text
/projects/:projectId/unit-projects/:unitProjectId/division-works/:divisionWorkId
```

页面目标：

```text
展示某个分部工程的进度和其下分项工程。
```

页面结构：

```text
DivisionWorkDetailPage
├─ Division Work Header
│  ├─ 分部工程名称
│  ├─ 编号
│  ├─ 专业类别
│  ├─ 状态
│  ├─ 计划日期
│  ├─ 实际日期
│  └─ 进度
│
├─ Sub Item Works Section
│  ├─ Create Sub Item Work 按钮
│  ├─ 分项工程列表
│  └─ 点击进入分项工程详情
│
└─ Related Tasks
   ├─ 问题项
   ├─ 协调事项
   └─ 施工任务
```

典型分部工程：

```text
地基与基础
主体结构
建筑装饰装修
屋面
建筑给水排水及供暖
建筑电气
智能建筑
通风与空调
建筑节能
电梯
```

## 10. 分项工程详情页

路径：

```text
/projects/:projectId/unit-projects/:unitProjectId/division-works/:divisionWorkId/sub-item-works/:subItemWorkId
```

页面目标：

```text
作为最细施工进度节点，展示计划、实际、进度填报和关联任务。
```

页面结构：

```text
SubItemWorkDetailPage
├─ Sub Item Header
│  ├─ 分项工程名称
│  ├─ 编号
│  ├─ 工种 / 工艺
│  ├─ 工程量
│  ├─ 单位
│  ├─ 状态
│  ├─ 计划日期
│  ├─ 实际日期
│  └─ 当前进度
│
├─ Plan vs Actual
│  ├─ 计划开始
│  ├─ 计划完成
│  ├─ 实际开始
│  ├─ 实际完成
│  └─ 偏差天数
│
├─ Progress Records
│  ├─ 日期
│  ├─ 完成工程量
│  ├─ 完成百分比
│  ├─ 填报人
│  └─ 现场说明
│
├─ Related Tasks
│  ├─ 待办任务
│  ├─ 质量问题
│  ├─ 延期风险
│  └─ 协调事项
│
└─ Comments
   └─ 沟通记录
```

典型分项工程：

```text
模板安装
钢筋安装
混凝土浇筑
砌体工程
一般抹灰
门窗安装
屋面防水
给水管道安装
配电箱安装
风管安装
```

## 11. Tasks 页面

路径：

```text
/issues
```

页面目标：

```text
保留现有 Issue 能力，但产品文案转为施工任务、问题项和协调事项。
```

列表字段：

```text
Tasks Table
├─ ID
├─ Title
├─ Project
├─ Unit Project
├─ Division Work
├─ Sub Item Work
├─ Status
├─ Priority
├─ Assignee
├─ Due Date
└─ Actions
```

筛选条件：

```text
Task Filters
├─ status
├─ projectId
├─ unitProjectId
├─ divisionWorkId
├─ subItemWorkId
├─ priority
├─ assignee
└─ overdue
```

短期实现策略：

```text
先保留 /issues 代码结构。
后续扩展 Issue schema，使任务可以关联到 Project / UnitProject / DivisionWork / SubItemWork。
```

## 12. 创建 / 编辑任务页

路径：

```text
/issues/new
/issues/:issueId/edit
```

表单字段：

```text
TaskForm
├─ title
├─ description
├─ projectId
├─ unitProjectId
├─ divisionWorkId
├─ subItemWorkId
├─ status
├─ priority
├─ dueDate
├─ progress
└─ assignee
```

字段联动：

```text
选择 Project 后加载 UnitProject。
选择 UnitProject 后加载 DivisionWork。
选择 DivisionWork 后加载 SubItemWork。
```

## 13. 推荐 API 结构

```text
Projects
├─ GET    /api/projects
├─ POST   /api/projects
├─ GET    /api/projects/:projectId
├─ PATCH  /api/projects/:projectId
└─ DELETE /api/projects/:projectId

Unit Projects
├─ GET    /api/projects/:projectId/unit-projects
├─ POST   /api/projects/:projectId/unit-projects
├─ GET    /api/unit-projects/:unitProjectId
├─ PATCH  /api/unit-projects/:unitProjectId
└─ DELETE /api/unit-projects/:unitProjectId

Division Works
├─ GET    /api/unit-projects/:unitProjectId/division-works
├─ POST   /api/unit-projects/:unitProjectId/division-works
├─ GET    /api/division-works/:divisionWorkId
├─ PATCH  /api/division-works/:divisionWorkId
└─ DELETE /api/division-works/:divisionWorkId

Sub Item Works
├─ GET    /api/division-works/:divisionWorkId/sub-item-works
├─ POST   /api/division-works/:divisionWorkId/sub-item-works
├─ GET    /api/sub-item-works/:subItemWorkId
├─ PATCH  /api/sub-item-works/:subItemWorkId
└─ DELETE /api/sub-item-works/:subItemWorkId

Tasks
├─ GET    /api/issues
├─ POST   /api/issues
├─ GET    /api/issues/:issueId
├─ PATCH  /api/issues/:issueId
└─ DELETE /api/issues/:issueId
```

## 14. 权限规则

```text
项目隔离
├─ 每个 Project 独立
├─ Project.ownerId 是该项目 admin
└─ A 项目的 admin 不自动拥有 B 项目的权限

创建权限
├─ 所有注册用户都可以创建 Project
└─ 创建后自动成为该 Project admin

管理权限
├─ Project admin 可以管理项目、单位工程、分部工程、分项工程
├─ Project admin 可以删除本项目内节点
└─ 普通用户后续通过成员表或任务分配获得访问权限
```

当前阶段：

```text
暂时保留 User.role 和 ADMIN，避免破坏现有 Issue 权限。
新的 Project 权限从第一天起只看 ownerId。
```

## 15. 分阶段实施路线

### Phase 1: 数据结构

```text
已完成 / 正在完成：
├─ Project
├─ UnitProject
├─ DivisionWork
├─ SubItemWork
└─ WorkStatus
```

### Phase 2: Project 页面和 API

```text
实现：
├─ /projects
├─ /projects/new
├─ /projects/:projectId
├─ /projects/:projectId/edit
└─ /api/projects
```

验收：

```text
用户可以创建项目。
项目创建者成为项目 admin。
项目详情展示单位工程列表入口。
```

### Phase 3: 单位工程 / 分部工程 / 分项工程页面

```text
实现：
├─ 单位工程 CRUD
├─ 分部工程 CRUD
├─ 分项工程 CRUD
├─ 层级面包屑
└─ 层级详情页
```

验收：

```text
Project 下可以创建 UnitProject。
UnitProject 下可以创建 DivisionWork。
DivisionWork 下可以创建 SubItemWork。
每层能显示状态、日期和进度。
```

### Phase 4: Task 关联施工层级

```text
实现：
├─ Issue 增加 projectId
├─ Issue 增加 unitProjectId
├─ Issue 增加 divisionWorkId
├─ Issue 增加 subItemWorkId
├─ Issue 增加 priority / dueDate / progress
└─ Issues 列表改为 Tasks 视角
```

验收：

```text
任务可以挂到具体分项工程。
任务列表可以按工程层级筛选。
项目详情能汇总本项目任务。
```

### Phase 5: 进度填报

```text
实现：
├─ ProgressRecord
├─ 分项工程进度填报
├─ 计划 vs 实际对比
├─ 偏差天数
└─ Dashboard 进度统计
```

验收：

```text
可以按日或周记录实际进度。
可以看到计划和实际偏差。
Dashboard 能显示逾期节点和整体进度。
```

## 16. 当前不做的内容

```text
第一版不做：
├─ 甘特图
├─ 检验批质量验收全流程
├─ 文件上传
├─ 合同管理
├─ 成本管理
├─ 材料设备管理
└─ 复杂项目成员权限
```

原因：

```text
当前目标是先把施工进度管理主线跑通。
Project -> UnitProject -> DivisionWork -> SubItemWork -> Task / ProgressRecord 已经能形成可用的进度管理骨架。
```
