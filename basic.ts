/*
  2.2.2 / プリミティブ型（string/number/boolean）
*/
let age: number = 36
let isDone: boolean = false
let color: string = '青'

/*
  2.2.3 / 配列
*/
const array: string[] = []
array.push('Takuya')
// array.push(4) 配列の方と合わないためエラー

const mixedArray = ['foo', 1]
const mixedArrayU: (string|number)[] = ['foo', 1] // Union型
const mixedArrayT: [string, number] = ['foo', 1]  // タプル


/*
  2.2.4 / オブジェクト型
*/
// string型のnameとnumber型のageのみを持つオブジェクトの型を定義
const user: { name: string; age: number } = {
  name: 'Takuya',
  age: 36
}

// オプショナル（省略可能）なプロパティ
function printName(obj: {firstName: string; lastName?: string}){
  //
}
// 以下どちらのパターンでも正常に動作
printName({firstName: 'Takuya'})
printName({firstName: 'Takuya', lastName: 'Tejima'})

/*
  2.2.5 / any
*/
// 全ての型を許容する
let user1: any = {firstName: 'Takuya'}
// 以下いずれもコンパイルエラーにならない
user1.hello()
user1()
user1.age = 100
user1 = 'hello'
// 他の型への代入を行なってもエラーば起きない
const n: number = user1

/*
  2.2.6 / 関数
*/
function sayHello(name: string): string {
  return `Hello ${name}`
}
sayHello('Takuya')

// オプショナルな引数
function Hello(name: string, greeting?: string): string {
  return `${greeting} ${name}`
}
Hello('Takuya')
Hello('Takuya', 'Hello')

// デフォルトな値
function Yahoo(name: string, greeting: string = 'Hello'): string {
  return `${greeting} ${name}`
}
Yahoo('Takuya')           // Hello Takuya
Yahoo('Takuya', 'Hey')    // Hey Takuya

// 関数を引数に取る関数の型指定
// 「名前」と「フォーマット関数」を引数として受け取りフォーマットを実行してコンソール出力を行う関数
function printN(firstName: string, formatter: (name: string) => string) {
  console.log(formatter(firstName))
}

// san を末尾につける名前のフォーマット関数
function formatName(name: string): string {
  return `${name} san`
}

printN('Takuya', formatName)

// アロー関数の場合
let Hey = (name: string): string => `Hello ${name}`

// _____________________________________________
// 関数の型
function genBirdsInfo(name: string): string[]{
  return name.split(',')
}
/*
  引数が文字列で戻り値が配列の関数を引数に取る
  関数の型を利用
  (x: string) => string[]
*/
function singBirds(birdInfo: (x: string) => string[]): string {
  return birdInfo('hato, kiji')[0] + ' piyo piyo'
}

console.log(singBirds(genBirdsInfo))  // hato piyo piyo
// console.log(singBirds('dobato'))   // 型が合わないためエラー
// _____________________________________________