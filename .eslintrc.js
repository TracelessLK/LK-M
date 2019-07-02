// strict
module.exports = {
  "env": {//一个环境定义了一组预定义的全局变量
    "es6": true,
    "jest/globals": true,
    "browser":true,
    "node":true
  },
  "parser": "babel-eslint",//设置解析器
  "plugins": [//可以使用 plugins 关键字来存放插件名字的列表。插件名称可以省略 eslint-plugin- 前缀
    "flowtype",
    "jest"
  ],
  settings: {//ESLint 支持在配置文件添加共享设置。你可以添加 settings 对象到配置文件，它将提供给每一个将被执行的规则
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      version: '15.0',
      flowVersion: '0.80.0'
    }
  },
  "extends": [//一个配置文件可以被基础配置中的已启用的规则继承。
    "eslint:recommended",
    "standard",
    "airbnb",
    "plugin:react/recommended"
  ],
  "parserOptions": {//ESLint 允许你指定你想要支持的 JavaScript 语言选项
    "ecmaVersion": 2018,
    "sourceType": "module",
    "ecmaFeatures": {//表示你想使用的额外的语言特性
      "jsx": true,
      "impliedStrict": true
    }
  },
  "rules": {
    'arrow-parens': 0,
    'func-names':0,//要求或禁止使用命名的 function 表达式
    'no-constant-condition':0,//禁止在条件中使用常量表达式
    'guard-for-in':0,//要求 for-in 循环中有一个 if 语句
    'no-empty':0,//禁止出现空语句块
    'react/prefer-stateless-function':0,//强制将无状态React组件编写为纯函数
    'no-useless-escape':0,//禁用不必要的转义字符
    'no-restricted-globals':0,//禁用特定的全局变量
    'no-multi-assign':0,//禁止连续赋值
    'no-bitwise':0,//禁用按位运算符
    'standard/object-curly-even-spacing':0,
    'promise/param-names':0,//在创建新承诺时强制执行一致的参数名称和排序。
    'react/jsx-curly-brace-presence':0,//在JSX道具和/或儿童中强制使用花括号或禁止不必要的花括号
    'react/jsx-props-no-multi-spaces':0,//禁止内联JSX道具之间的多个空格
    'react/jsx-equals-spacing':2,//强制或禁止JSX属性中等号周围的空格。
    'prefer-const':0,//要求使用 const 声明那些声明后不再被修改的变量
    'no-alert':0,//禁用 alert、confirm 和 prompt
    'class-methods-use-this':0,//强制类方法使用 this
    'react/no-unused-state':0,//防止未使用状态的定义
    'react/display-name':0,//防止在React组件定义中缺少displayName
    'react/jsx-no-duplicate-props':2,//防止JSX中的重复属性
    'no-param-reassign':0,//禁止对 function 的参数进行重新赋值
    'react/no-unused-prop-types':0,//防止未使用的prop类型的定义
    'brace-style':0,//强制在代码块中使用一致的大括号风格
    'require-await':0,//禁止使用不带 await 表达式的 async 函数
    'react/no-access-state-in-setstate':0,//防止在this.setState中使用this.state
    'react/jsx-closing-tag-location':0,//在JSX中验证结束标记位置
    'arrow-body-style':0,//要求箭头函数体使用大括号
    'prefer-destructuring':0,//优先使用数组和对象解构
    'react/self-closing-comp':0,//防止没有子节点的组件的额外关闭标签
    'react/no-string-refs':0,//防止使用字符串引用
    'import/prefer-default-export':0,//当模块中只有一个导出时，更喜欢使用默认导出而不是命名导出。
    'import/no-dynamic-require':0,//禁止require()使用表达式调用
    'react/no-direct-mutation-state':0,//防止this.state的直接突变
    'no-cond-assign':0,//禁止条件表达式中出现赋值操作符
    'react/sort-comp':0,//强制执行组件方法顺序
    'react/jsx-closing-bracket-location':0,//验证JSX中的右括号位置
    'react/jsx-tag-spacing':0,//验证JSX开始和结束括号内和周围的空格
    'space-before-function-paren':0,
    'jsx-quotes':0,//强制在 JSX 属性中一致地使用双引号或单引号
    'react/jsx-wrap-multilines':0,//防止多行JSX周围缺少括号
    'implicit-arrow-linebreak':0,//强制隐式返回的箭头函数体的位置
    'react/jsx-max-props-per-line':0,//限制JSX中单行上道具的最大数量
    'object-curly-newline':0,//强制大括号内换行符的一致性
    'react/jsx-first-prop-new-line':0,//配置第一个属性的位置
    'import/order': 0,
    'spaced-comment':0,//强制在注释中 // 或 /* 使用一致的空格
    'react/no-array-index-key':0,//防止在键中使用Array索引
    'no-use-before-define':0,//禁止在变量定义之前使用它们
    'comma-spacing':2,//强制在逗号前后使用一致的空格
    'import/no-extraneous-dependencies':0,//禁止使用无关的包
    'quotes':0,//强制使用一致的反勾号、双引号或单引号
    'import/newline-after-import':2,//强制在最后一个顶级导入语句或需要调用之后有一个或多个空行
    'prefer-template':0,//要求使用模板字面量而非字符串连接
    'arrow-parens':0,//要求箭头函数的参数使用圆括号
    'object-curly-spacing': 0,//强制在大括号中使用一致的空格
    'react/jsx-one-expression-per-line': 0,
    'react/destructuring-assignment': 0,
    'react/prop-types': 0,
    "no-inner-declarations": 0,//禁止在嵌套的块中出现变量声明或 function 声明
    "consistent-return": 2,//要求 return 语句要么总是指定返回的值，要么不指定
    "no-proto": 2,//禁用 __proto__ 属性
    "no-undef-init": 2,//禁止将变量初始化为 undefined
    "no-new-func": 2,//禁止对 Function 对象使用 new 操作符
    "no-console": 0,//禁用 console
    "no-debugger": 2,//禁用 debugger
    "no-eval": 2,//禁用 eval()
    "global-require": 0,//要求 require() 出现在顶层模块作用域中
    "no-implied-eval": 2,//禁止使用类似 eval() 的方法
    "no-extend-native": 2,//禁止扩展原生类型
    "no-throw-literal": 2,//禁止抛出异常字面量
    "no-extra-parens": 2,//禁止不必要的括号
    "no-iterator": 2,//禁用 __iterator__ 属性
    "no-shadow": 2,//禁止变量声明与外层作用域的变量同名
    "no-labels": 2,//禁用标签语句
    "sort-vars": 2,//要求同一个声明块中的变量按顺序排列
    "object-shorthand": 2,//要求或禁止对象字面量中方法和属性使用简写语法
    "valid-jsdoc": 2,//强制使用有效的 JSDoc 注释
    "dot-notation": 2,//强制尽可能地使用点号
    "no-loop-func": 2,//禁止在循环中出现 function 声明和表达式
    "no-script-url": 2,//禁止使用 javascript: url
    "no-process-exit": 0,//禁用 process.exit()
    "accessor-pairs": 2,//强制 getter 和 setter 在对象中成对出现
    "array-callback-return": 2,//强制数组方法的回调函数中有 return 语句
    "curly": ["error", "all"],//强制所有控制语句使用一致的括号风格
    "default-case": 2,//要求 switch 语句中有 default 分支
    "for-direction": 2,//强制 “for” 循环中更新子句的计数器朝着正确的方向移动
    "getter-return": 2,//强制 getter 函数中出现 return 语句
    "no-await-in-loop": 0,//禁止在循环中出现 await
    "no-caller": 2,//禁用 arguments.caller 或 arguments.callee
    "no-empty-function": 2,//禁止出现空函数
    "no-extra-bind": 2,//禁止不必要的 .bind() 调用
    "no-extra-label": 2,//禁用不必要的标签
    "no-floating-decimal": 2,//禁止数字字面量中使用前导和末尾小数点
    "no-template-curly-in-string": 2,//禁止在常规字符串中出现模板字面量占位符语法
    "eqeqeq": ["error", "always"],//要求使用 === 和 !==
    "no-lone-blocks": 2,//禁用不必要的嵌套块
    "no-new": 0,//禁止使用 new 以避免产生副作用
    "no-new-wrappers": 2,//禁止对 String，Number 和 Boolean 使用 new 操作符
    "no-return-assign": 2,//禁止在 return 语句中使用赋值语句
    "no-return-await": 2,//禁用不必要的 return await
    "no-self-compare": 2,//禁止自身比较
    "no-sequences": 2,//禁用逗号操作符
    "no-unmodified-loop-condition": 0,//禁用一成不变的循环条件
    "no-unused-expressions": 2,//禁止出现未使用过的表达式
    "no-useless-call": 2,//禁止不必要的 .call() 和 .apply()
    "no-useless-return": 2,//禁止多余的 return 语句
    "no-void": 2,//禁用 void 操作符
    "no-with": 2,//禁用 with 语句
    "prefer-promise-reject-errors": 2,//要求使用 Error 对象作为 Promise 拒绝的原因
    "no-shadow-restricted-names": 2,//禁止将标识符定义为受限的名字
    "no-label-var": 2,//不允许标签与变量同名
    "no-useless-rename": 2,//禁止在 import 和 export 和解构赋值时将引用重命名为相同的名字
    "callback-return": 2,//强制数组方法的回调函数中有 return 语句
    "handle-callback-err": 2,//要求回调函数中有容错处理
    "no-buffer-constructor": 2,//禁用 Buffer() 构造函数
    "no-new-require": 2,//禁止调用 require 时使用 new 操作符
    "no-path-concat": 2,//禁止对 __dirname 和 __filename 进行字符串连接
    "no-confusing-arrow": 2,//禁止在可能与比较操作符相混淆的地方使用箭头函数
    "no-useless-computed-key": 2,//禁止在对象中使用不必要的计算属性
    "no-duplicate-imports": 2,//禁止重复模块导入
    "radix": [2, "as-needed"],//强制在parseInt()使用基数参数
    'no-unused-vars': ["error", {"args": "after-used"}],//禁止出现未使用过的变量
    "no-var": 2,//要求使用 let 或 const 而不是 var
    "semi": [2, "never"],//要求或禁止使用分号代替 ASI
    "comma-dangle": ["error", "never"],//要求或禁止末尾逗号
    "react/jsx-filename-extension": 0,//限制可能包含JSX的文件扩展名
    "no-plusplus": 0,//禁用一元操作符 ++ 和 --
    "no-restricted-syntax": 0,//禁用特定的语法
    "no-loop-func": 0,//禁止在循环中出现 function 声明和表达式
    "no-underscore-dangle": 0,//禁止标识符中有悬空下划线
    "react/forbid-prop-types": 0,//禁止某些propTypes
    "react/require-default-props": 0,//为每个不是必需道具的道具强制执行defaultProps定义
    "max-len": 0,//强制一行的最大长度
    'no-continue':0,

    //fixme: in ChatView.js `import ImageResizer from 'react-native-image-resizer'`
    "import/no-unresolved": 0

  },
  globals: {//指定全局变量
    "__DEV__": true,
    "WebSocket":true,
    'fetch':true,
    'alert':true,
    'isNaN':true,
    'fs':true,
    'path':true
  },

};
