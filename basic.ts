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