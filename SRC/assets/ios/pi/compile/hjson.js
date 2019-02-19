_$define("pi/compile/hjson", function (require, exports, module){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * tpl的词法和语法分析器
 */
var reader_1 = require("../compile/reader");
var parser_1 = require("../compile/parser");
var scanner_1 = require("../compile/scanner");
//TEXT 文本状态 0
//文本态无法直接切换到htmlAttr和htmlstr态,只能切换到另外3个状态
// 测试初始化
exports.parserTpl = function (tpl, filename, errFunc) {
	var reader = reader_1.createByStr(tpl);
	var scanner = new scanner_1.Scanner();
	scanner.setRule(lexText, "0");
	scanner.setRule(lexScript, "1");
	scanner.setRule(lexStr, "4");
	scanner.setRule(lexJson, "10");
	scanner.initReader(reader);
	var parser = new parser_1.Parser();
	parser.setRule(syntaxTpl, cfgTpl);
	parser.initScanner(scanner);
	var syntax = parser.parseRule("body");
	if (parser.cur) {
		console.log("\x1B[31m error: \"" + filename + "\"\u89E3\u6790\u51FA\u9519,lastIndex is : " + parser.lastIndex + ", lastMatch is : " + JSON.stringify(parser.lastMatch) + "\x1B[0m");
		if (errFunc) {
			errFunc(" error: \"" + filename + "\"\u89E3\u6790\u51FA\u9519,lastIndex is : " + parser.lastIndex + ", lastMatch is : " + JSON.stringify(parser.lastMatch));
		}
	}
	return syntax;
};
var lexText = "\nwhitespace = {?whitespace?}#?;\n(* comment *)\ncommentBlock = \"{{%\" , [ { & !\"}}\"!, ?all? & } ], \"}}\" ;\n(* \u5207\u6362\u5230\u811A\u672C\u6001 *)\n\"{{\" = \"{{\";\n(* \u5207\u6362\u5230json\u6001,\u53EA\u6709\u5728tpl\u4E2D\u5411\u4E0B\u4F20\u9012\u6570\u636E\u624D\u4F1A\u51FA\u73B0json\u6001 *)\n\"{\" = \"{\";\n(* \u5207\u6362\u5230json\u6001,\u53EA\u6709\u5728tpl\u4E2D\u5411\u4E0B\u4F20\u9012\u6570\u636E\u624D\u4F1A\u51FA\u73B0json\u6001, \u6570\u7EC4\u662Fjson\u7684\u7279\u6B8A\u5B58\u5728\u5F62\u5F0F *)\n\"[\" = \"[\";\n\",\" = \",\";\n";
//JS 脚本状态 4
var lexStr = "\n(* comment *)\n\n\"{{\" = \"{{\";\nstringstr =  { & !'\"'!, !'{{'!, ?visible? & };\nquota =  '\"';\n";
//JS 脚本状态 1
var lexScript = "\n\twhitespace = {?whitespace?}#?;\t\n\n\t(* \u7279\u6B8A\u7684\u51FD\u6570\u58F0\u660E *)\n\n\t(* back *)\t\n\t\"}}\" = \"}}\";\n\n\t(* separator *)\n\t\",\" = \",\";\n\t\".\" = \".\";\n\t\";\" = \";\";\n\t\":\" = \":\";\n\t\"{\" = \"{\";\n\t\"}\" = \"}\";\n\t\"(\" = \"(\";\n\t\")\" = \")\";\n\t\"[\" = \"[\";\n\t\"]\" = \"]\";\n\n\t(* type keyword *)\n\ttrue = & \"true\", identifier &;\n\tfalse = & \"false\", identifier &;\n\tnull = & \"null\", identifier &;\n\tundefined = & \"undefined\", identifier &;\n\t(* keyword *)\n\tif = & \"if\", identifier &;\n\telseif = & \"elseif\", identifier &;\n\telse = & \"else\", identifier &;\n\tend = & \"end\", identifier &;\n\tfor = & \"for\", identifier &;\n\twhile = & \"while\", identifier &;\n\tlet = & \"let\", identifier &;\n\tvar = & \"var\", identifier &;\n\tswitch = & \"switch\", identifier &;\n\ttry = & \"try\", identifier &;\n\tcatch = & \"catch\", identifier &;\n\tfinally = & \"finally\", identifier &;\n\tcase = & \"case\", identifier &;\n\tdefault = & \"default\", identifier &;\n\treturn = & \"return\", identifier &;\n\t\n\t\n\tnew = & \"new\", identifier &;\n\tfunction =  & \"function\", identifier &;\n\t\n\tbreak = & \"break\", identifier &;\n\tcontinue = & \"continue\", identifier &;\n\tof = & \"of\", identifier &;\n\tin = & \"in\", identifier &;\n\n\t(* normal *)\n\tidentifier = [{\"_\"}], ?alphabetic? , [ { |?word?, \"$\"| } ] ;\n\tfloat = [| \"0\", integer10 |], \".\", { ? digit ? }, [floate] ;\n\tfloate = |\"e\", \"E\"|, |\"+\", \"-\"|, { ? digit ? } ;\n\tinteger16 = \"0x\" , { |? digit ?, 'A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f' | } ;\n\tinteger = | \"0\", integer10 | ;\n\tinteger10 = ? digit19 ? , [ { ? digit ? } ] ;\n\tregular = \"/\",{& !\"/\"!, !\"}}\"!, !\" \"!, ?visible? &},|\"/gi\", \"/ig\", \"/g\", \"/i\", \"/\"|;\n\t(* \u811A\u672C\u6001\u5185\u90E8\u80AF\u5B9A\u662F\u666E\u901A\u5B57\u7B26\u4E32 *)\n\tstring = '\"', [{ | '\\\"', & !'\"'!, ?visible? & | }], '\"' ;\n\tsinglequotestring = \"'\", [{ | \"\\'\", & !\"'\"!, ?visible? & | }], \"'\" ;\n\n\t(* compare operator *)\n\t\"===\" = \"===\";\n\t\"!==\" = \"!==\";\n\t\"==\" = \"==\";\n\t\"!=\" = \"!=\";\n\t\"<=\" = \"<=\";\n\t\">=\" = \">=\";\n\t(* assignment operator *)\n\t\"=\" = \"=\";\n\t\"+=\" = \"+=\";\n\t\"-=\" = \"-=\";\n\t\"*=\" = \"*=\";\n\t\"/=\" = \"/=\";\n\t\"%=\" = \"%=\";\n\t\"<<=\" = \"<<=\";\n\t\">>=\" = \">>=\";\n\t\">>>=\" = \">>>=\";\n\t\"&=\" = \"&=\";\n\t\"|=\" = \"|=\";\n\t\"^=\" = \"^=\";\n\t(* arithmetic operator *)\n\t\"++\" = \"++\";\n\t\"--\" = \"--\";\n\t\"**\" = \"**\";\n\t\"+\" = \"+\";\n\t\"-\" = \"-\";\n\t\"*\" = \"*\";\n\t\"/\" = \"/\";\n\t\"%\" = \"%\";\n\t(* bool operator *)\n\t\"&&\" = \"&&\";\n\t\"||\" = \"||\";\n\t\"!\" = \"!\";\n\t(* bit operator *)\n\t\"&\" = \"&\";\n\t\"|\" = \"|\";\n\t\"~\" = \"~\";\n\t\"^\" = \"^\";\n\t\">>>\" = \">>>\";\n\t\"<<\" = \"<<\";\n\t\">>\" = \">>\";\n\t(* compare operator *)\n\t\"<\" = \"<\";\n\t\">\" = \">\";\n\t(* condition operator *)\n\t\"?\" = \"?\";\n";
//json状态 10
var lexJson = "\nwhitespace = {?whitespace?}#?;\n(* separator *)\n\"{{\" = \"{{\";\n\",\" = \",\";\n\":\" = \":\";\n\"{\" = \"{\";\n\"}\" = \"}\";\n\"[\" = \"[\";\n\"]\" = \"]\";\n\"quota\" = '\"';\n\n(* normal \u53EA\u652F\u6301\u53CC\u5F15\u53F7 *)\n(* \u57FA\u7840\u7684\u6570\u636E\u5C31\u53EA\u6709 \u8FD95\u79CD*)\nnumber = |  integer16, float, integer | ;\nbool = | true , false |;\nnull = & \"null\", identifier &;\nundefined = & \"undefined\", identifier &;\n\ntrue = & \"true\", identifier &;\nfalse = & \"false\", identifier &;\nfloat = [[ \"-\" ] , | \"0\", integer10 |], \".\", { ? digit ? }, [floate] ;\nfloate = |\"e\", \"E\"|, |\"+\", \"-\"|, { ? digit ? } ;\ninteger16 = [ \"-\" ] , \"0x\" , { |? digit ?, 'A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f' | } ;\ninteger = | \"0\", integer10 | ;\ninteger10 = [ \"-\" ] , ? digit19 ? , [ { ? digit ? } ] ;\nidentifier = [{\"_\"}], ?alphabetic? , [ { |?word?, \"$\"| } ] ;\n";
//状态 0:text 1:js 2:html 3:htmlAttr 4:htmlAttrStr 10: json 
//语法
//j代表json,s代表script
var syntaxTpl = "\n\tscript = \"{{\"#?1, | if, for, while, exec,  def,  jsbreak, jscontinue, jsexpr|;\n\tbody = | {|jarr, jobj, jpair, script|,[\",\"#?]}, jstring, \"number\",\"bool\",\"null\", jscript, [\",\"#?]|;\n\tjobj = \"{\"#?10,  [|jpair,script|], [{[\",\"#?], |jpair,script|}], \"}\"#?back ;\n\tjarr = \"[\"#?10, [|jstring, \"number\",\"bool\",\"null\", jobj, jarr, script, jscript|, [{[\",\"#?], |jstring, \"number\",\"bool\",\"null\", jobj, jarr, script, jscript|}]], \"]\"#?back;\n\tjpair = |\"identifier\", jstring|, \":\"#?, |jstring, \"number\",\"bool\",\"null\", jobj, jarr, script, jscript|, [\",\"#?];\n\tjscript = \"quota\"#?4, [\"stringstr\"], script, [{[\"stringstr\"],script}], [\"stringstr\"], \"quota\"#?back;\n\tjstring = \"quota\"#?4, [\"stringstr\"], \"quota\"#?back;\n\n\tcond = ?expr?, \":\"#?, ?expr?;\n\tfield = \"identifier\";\n\tfielde = ?expr?, \"]\"#?;\n\tbracket = ?expr?, \")\"#?;\n\tcall = [?expr?, [{\",\"#?, ?expr?}]], \")\"#?;\n\tnew = \"identifier\", [\"(\"#?, [?expr?, [{\",\"#?, ?expr?}]], \")\"#?];\n\tarr = [?expr?, [{\",\"#?, ?expr?}]], \"]\"#?;\n\tkv = |\"identifier\", \"string\"|, \":\"#?, ?expr?;\n\tobj = [kv, [{\",\"#?, kv}]], \"}\"#?;\t\n\n\tif = \"if\"#?, ?expr?, \"}}\"#?back, body, [{elseif}], [else], \"{{\"#?1, \"end\"#?, \"}}\"#?back;\n\telseif = \"{{\"#?1, \"elseif\"#?, ?expr?, \"}}\"#?back, body;\n\telse = \"{{\"#?1, \"else\"#?, \"}}\"#?back, body;\n\twhile = \"while\"#?, ?expr?, \"}}\"#?back, body,\"{{\"#?1, \"end\"#?, \"}}\"#?back;\n\tfor = \"for\"#?, \"identifier\", [\",\"#? , \"identifier\"], |\"of\", \"in\"|, ?expr?, \"}}\"#?back, , body,\"{{\"#?1, \"end\"#?, \"}}\"#?back;\n\tdv = \"identifier\", [\"=\"#?, ?expr?];\n\tdef = \"let\"#?, [dv, [{\",\"#?, dv}]], \"}}\"#?back;\n\texec = \":\"#?, ?expr?, [{\",\",?expr?}], \"}}\"#?back;\n\t(*\u53EA\u652F\u6301\u4E86\u4E00\u6761\u547D\u4EE4 *)\n\tjsexpr = & ! | \"break\", \"continue\", \"end\", \"else\", \"elseif\"| ! ,?expr? &, \"}}\"#?back;\n\tjsbreak = \"break\",\"}}\"#?back;\n\tjscontinue = \"continue\",\"}}\"#?back;\n\texprgroup = [?expr?, [{\",\"#?, ?expr?}]];\n\n\t(* js \u7279\u6709\u90E8\u5206*)\n\tjsfn = \"(\"#?, jsfnargs, \")\"#?, jsblock;\n\tjsfnargs = [\"identifier\", [{\",\"#?, \"identifier\"}]];\n\tjsblock = \"{\"#?, [{?expr?, [\";\"#?]}], \"}\"#?;\n\tjsbody = | @\"{\"#?, [{?expr?, [\";\"#?]}], \"}\"#?@, @?expr?, [\";\"#?]@ |;\n\tjsif = \"(\"#?, ?expr?, \")\"#?, jsbody, [{jselseif}], [jselse];\n\tjselseif = \"else\"#?, \"if\"#?, \"(\"#?, ?expr?, \")\"#?, jsbody;\n\tjselse = \"else\"#?, jsbody;\n\tjswhile = \"(\"#?, ?expr?, \")\"#?, jsbody;\n\tjsfor = \"(\"#?, exprgroup, \";\"#?, exprgroup, \";\"#?, exprgroup, \")\"#?, jsbody;\n\tjsswitch = \"(\"#?, ?expr?, \")\"#?, \"{\"#?, {jscase}, [jsdefault], \"}\"#?;\n\tjscase = \"case\"#?, | \"integer\", \"integer16\", \"float\", \"string\" |, \":\"#?, [{?expr?, \";\"#?}];\n\tjsdefault = \"default\"#?, \":\"#?, [{?expr?, \";\"#?}];\n\tjstry = jsblock, [jscatch], [jsfinally];\n\tjscatch = \"catch\"#?, \"(\"#?, \"identifier\", \")\"#?, jsblock;\n\tjsfinally = \"finally\"#?, jsblock;\n\tjsdef = [dv, [{\",\"#?, dv}]];\n\tjsreturn = [{?expr?}];\n";
//attr = "identifier", ["="?, |scriptvalue, tagscript2, value|];
//scriptvalue = "lstring", tagscript2, "rstring";
var cfgTpl = [
// 表达式结束符
{ type: ",", rbp: -1 }, { type: ";", rbp: -1 }, { type: ")", rbp: -1 }, { type: "]", rbp: -1 }, { type: "}", rbp: -1 }, { type: "}}", rbp: -1 },
// 最低优先级运算符
{ type: "string" },
// 赋值运算符
{ type: "=", lbp: 10, rbp: 9 }, { type: "+=", lbp: 10, rbp: 9 }, { type: "-=", lbp: 10, rbp: 9 }, { type: "*=", lbp: 10, rbp: 9 }, { type: "/=", lbp: 10, rbp: 9 }, { type: "%=", lbp: 10, rbp: 9 }, { type: "<<=", lbp: 10, rbp: 9 }, { type: ">>=", lbp: 10, rbp: 9 }, { type: ">>>=", lbp: 10, rbp: 9 }, { type: "&=", lbp: 10, rbp: 9 }, { type: "|=", lbp: 10, rbp: 9 }, { type: "^=", lbp: 10, rbp: 9 },
// 条件运算符
{ type: "?", lbp: 20, rbp: 19, led: "cond" },
// 关系运算符
{ type: "||", lbp: 30, rbp: 29 }, { type: "&&", lbp: 32, rbp: 31 }, { type: "|", lbp: 35 }, { type: "^", lbp: 36 }, { type: "&", lbp: 37 },
// 布尔运算符
{ type: "===", lbp: 40 }, { type: "!==", lbp: 40 }, { type: "==", lbp: 40 }, { type: "!=", lbp: 40 }, { type: "<=", lbp: 45 }, { type: ">=", lbp: 45 }, { type: "<", lbp: 45 }, { type: ">", lbp: 45 }, { type: "in", lbp: 45 }, { type: "instanceof", lbp: 45 },
// 按位移动符
{ type: "<<", lbp: 50 }, { type: ">>", lbp: 50 }, { type: ">>>", lbp: 50 },
// 算数运算符
{ type: "+", lbp: 60 }, { type: "-", lbp: 60 }, { type: "*", lbp: 70 }, { type: "/", lbp: 70 }, { type: "%", lbp: 70 }, { type: "**", lbp: 70 },
// 前缀运算符
{ type: "!", rbp: 80 }, { type: "~", rbp: 80 }, { type: "+", rbp: 80 }, { type: "-", rbp: 80 }, { type: "++", rbp: 80 }, { type: "--", rbp: 80 }, { type: "typeof", rbp: 80 }, { type: "void", rbp: 80 }, { type: "delete", rbp: 80 },
// 后缀运算符
{ type: "++", lbp: 85, suf: true }, { type: "--", lbp: 85, suf: true },
// 域运算符
{ type: ".", lbp: 100, led: "field" }, { type: "[", lbp: 100, led: "fielde" },
//函数调用
{ type: "(", rbp: 90, led: "call" }, { type: "new", rbp: 90, led: "new" },
// 算数表达式
{ type: "(", lbp: 1000, nud: "bracket" },
// 对象字面量
{ type: "{", nud: "obj" }, { type: "[", nud: "arr" },
// statement 语句
{ type: "let", nud: "jsdef" }, { type: "var", nud: "jsdef" }, { type: "if", nud: "jsif" }, { type: "for", nud: "jsfor" }, { type: "while", nud: "jswhile" }, { type: "switch", nud: "jsswitch" }, { type: "try", nud: "jstry" }, { type: "function", nud: "jsfn" }, { type: "dv", nud: "dv" }, { type: "return", nud: "jsreturn" },
// 忽略空白
{ type: "whitespace", ignore: true },
// 注释
{ type: "commentBlock", note: 1 }];
// expr  +  expr  -  expr  *  expr  /
})