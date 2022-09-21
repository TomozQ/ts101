/*
  2.5.1 / Optional Chaining
*/
// ネストされたオブジェクトのプロパティが存在するかどうかの条件分岐を簡単に記述できる機能
// nullになり得るsocialというプロパティを定義
interface User {
  name: string
  social?: {
    facebook: boolean
    twitter: boolean
  }
}

let user: User

user = {
  name: 'Takuya',
  social: {
    facebook: true,
    twitter: true
  }
}
console.log(user.social?.facebook)  // true

user = { name: 'Takuya' }
// socialが存在しないケースでも以下のコードは実行時エラーにならない
console.log(user.social?.facebook)

/*
  2.5.2 / Non-null Assertion Operator
*/
// --strictNullChacksを指定してコンパイルする場合、TypeScriptは通常nullの可能性のあるオブジェクトへのアクセスはエラーとして扱う
// nullでないことを示したいとき、Non-null Assertionという機能で、明示的にコンパイラに問題がないことを伝えられる。
// userがnullの場合、実行時エラーになる可能性があるプロパティへのアクセスはコンパイルエラー
function processUser(user?: User){
  let s = user!.name  // コンパイラにエラーを起こさなくていいとマークをつけているだけで実際実行時にエラーにならないということではない
}

/*
  2.5.3 / 型ガード
*/
// if文やswitch文の条件分岐にて型のチェックをおこなった際、その条件分岐ブロック以降は変数の型を絞り込まれる推論が行われ、これを型ガードと呼ぶ
// numberとstringのUnion型で定義された引数をtypeofを用いてstring型の判定をするif文を記述したとすると、ifブロック以降の引数である変数は自動的にnumber型であると扱われる。
function addOne(value: number | string){
  if (typeof value === 'string'){
    return Number(value) + 1
  }
  return value + 1  // valueはnumberであると推論される
}
console.log(addOne(10))   // 11
console.log(addOne('20')) // 21

// オプショナルのプロパティとして定義された値をif文で絞り込む際も同様に型ガードの機能により、if文の中ではnull安全なプロパティとして扱うことができる
type UserType = {
  info?: {
    name: string
    age: number
  }
}
let response = {} // JSON形式のAPIレスポンスが代入されている想定。UserTypeに型アサーションする
const user1 = (response as any) as UserType
// オプショナルのプロパティへの型ガードを行う
if (user1.info) {
  // オプショナルプロパティは以下のプロパティであるuser.info.nameにアクセスしてもエラーにならない
  // もしifの条件がない場合はObject is possibly 'undefined' というエラーが発生する。
  console.log(user1.info.name)
}

/*
  2.5.4 / keyofオペレーター
*/
interface UserInterface {
  name: string
  age: number
  email: string
}
type UserKey = keyof UserInterface  // 'name' | 'age' | 'email'というUnion型になる

const key1: UserKey = 'name'  // 代入可能
const key2: UserKey = 'phone' // エラー

// 第一引数に渡したオブジェクトの型のプロパティ名のUnion型と、第二引数で渡す値が一致しない場合型エラーになる
// T[K]によりキーに対応する型が戻り値の方となる（例えば上記UserInterfaceのageをkeyに渡した場合、戻り値の方はnumberになる）
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
const user2: UserInterface = {
  name: 'Takuya',
  age: 36,
  email: 'test@example.com',
}
// nameは型のキーに存在するため正しくstring型の値が返る
const userName = getProperty(user2, 'name')
// genderはオブジェクトのキーに存在しないためコンパイルエラー
const userGender = getProperty(user2, 'gender')

/*
  2.5.5 / インデックス型
*/
// オブジェクトのプロパティが可変の時、まとめて型を定義できる。
// プロパティ名を任意のnumberとして扱う方の定義例
type SupportVersions = {
  [env: number]: boolean
}
// stringのプロパティに定義した場合エラー
let versions: SupportVersions = {
  102: false,
  103: false,
  104: true,
  'v105': true  // ← error
}

/*
  2.5.6 / readonly
*/
type UserType2 = {
  readonly name: string
  readonly gender: string
}

let user3: UserType2 = { name: 'Takuya', gender: 'Male' }
user3.gender = 'Femail' // error

// Readonly型
type UserType3 = {
  name: string
  gender: string
}

type UserReadonly = Readonly<UserType3>

let user4: UserType3 = {name: 'Takuya', gender: 'Male'}

let userReadonly: UserReadonly = { name: 'Takuya', gender: 'Male' }
user.name = 'Yoshiki'
userReadonly.name = 'Yoshike' // error

/*
  2.5.7 / unknown
*/
// anyと同様にどんな値でもunknownとして代入することができる
const x: unknown = 123
const y: unknown = 'Hello'

// 関数やプロパティにアクセスした際に、unknown型そのままではコンパイル時にエラーが発生する
console.log(x.toFixed(1))     // error
console.log(y.toLowerCase())  // error

// 型安全な状況下で関数やプロパティにアクセスして実行できる
if(typeof x === 'number'){
  console.log(x.toFixed(1)) // 123.0
}

if(typeof y === 'string'){
  console.log(y.toLowerCase())  // hello
}
// anyを使用するよりも安全なコードを書くことができる

/*
  2.5.8 / 非同期のAsync/Await
*/
// 非同期APIのPromiseの簡易的な構文にあたるものがAsync/Awaitの機能
function fetchFromServer(id: string): Promise<{success: boolean}> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({success: true})
    }, 100)
  })
}
// 非同期処理を含むasync functionの戻り値の型はPromiseとなる
async function asyncFunc(): Promise<string>{
  // Promiseな値をawaitすると中身が取り出せる（ようになる）
  const result = await fetchFromServer('111')
  return `The result: ${result.success}`
}
// await構文を使うためにはasync functionの中で呼び出す必要がある
(async() => {
  const result = await asyncFunc()
  console.log(result)
})()

// Promiseとして扱うには以下のように記述する
asyncFunc().then(result => console.log(result))

/*
  2.5.9 / 型定義ファイル
*/
