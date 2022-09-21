/*
  2.4.1 / Enum型
*/
/*
  const Direction = {
    'Up': 0,
    'Down': 1,
    'Left': 2,
    'Right': 3,
  }
*/
// enumを用いた定数定義
enum Direction {  // 特に指定しない場合Enumは定義された順番に沿ってゼロから数字が自動的にインクリメントされる
  Up,
  Down,
  Left,
  Right
}

let direction: Direction = Direction.Left
console.log(direction)  // 2という数字が出力される
// enumを代入した変数に別の型の値を代入しようとするとエラーになる
direction = 'Left'    // stringを入れようとするとエラー


// 文字列ベースのEnum
enum DirectionStr {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}
// 例えばAPIのパラメータとして文字列が渡されたケースを想定
const value = 'DOWN'
// 文字列からEnumに変換
const enumValue = value as DirectionStr
if (enumValue === DirectionStr.Down) {  // 文字列で渡される値とEnumの定数値を比較する際に便利
  console.log('Down is selected')
}

/*
  2.4.2 / ジェネリック型
*/
// クラスや関数において、その中で使う型を抽象化し外部から具体的な型を指定できる機能。
// 外部から指定される型が異なっても動作するような汎用的なクラスや関数を実装する際に便利
class Queue<T> {  // Tはクラス内で利用する仮の型の名前
  // 内部にTの型の配列を初期化する
  private array: T[] = []

  // Tの型の値を配列に追加
  push(item: T) {
    this.array.push(item)
  }

  // Tの型の配列の最初の値を取り出す
  pop(): T | undefined {
    return this.array.shift()
  }
}
// 数値型を扱うキューを生成
const queue = new Queue<number>()
queue.push(111)
queue.push(112)
queue.push('hoge')    // number型ではないのでエラー

let str = 'fuga'
str = queue.pop() // strはnumber型ではないのでコンパイル時エラーになる。

/*
  2.4.3 / Union型とIntersection型
*/
// 指定した複数の型の和集合をUnion型・積集合をIntersection型

// Union型は指定したいずれかの型に当てはまれば良い型が生成される
// 変数や引数の宣言時にUnion型を指定して、numberもしくはstringを受け付けることができる
function printId(id: number | string) {
  console.log(id)
}
// numberでもstringでも動作する
printId(11)
printId('22')

// 型エイリアスとして定義
type Id = number | string

function printId2(id: Id) {
  console.log(id)
}

// 型エイリアス同士を掛け合わせて新たな型を定義
type Identity = {
  id: number | string
  name: string
}
type Contact = {
  name: string
  email: string
  phone: string
}
// 和集合による新たなUnion型の定義
// IdentityもしくはContactの型を受けることが可能
type IdentityOrContact = Identity | Contact
// OK
const id1: IdentityOrContact = {
  id: '111',
  name: 'Takuya',
}
// OK
const contact: IdentityOrContact = {
  name: 'Takuya',
  email: 'test@example.com',
  phone: '012345678'
}

// Intersection型は複数の型をマージして一つとなった型
type Employee = Identity & Contact
// OK
const employee: Employee = {
  id: '111',
  name: 'Takuya',
  email: 'test@example.com',
  phone: '012345678',
}
// NG Contact情報のみでの変数定義はできない。Identityのプロパティであるidが必要
const employeeContact: Employee = {
  name: 'Takuya',
  email: 'test@example.com',
  phone: '012345678',
}

/*
  2.4.4 / リテラル型
*/
// 決まった文字れるや数値しか入らない型という制御が可能
let postStatus: 'draft' | 'published' | 'deleted'
postStatus = 'draft'    // OK
postStatus = 'drafts'   // NG 型宣言にない文字列が割り当てられているためエラー

// 数字に対してのリテラル型
// -1, 0, 1 いずれかしか返さない型情報を定義
function compare(a: string, b:string): -1 | 0 | 1 {
  return a === b ? 0: a > b ? 1 : -1
}

/*
  2.4.5 / never型
*/
// 決して発生しない値の種類を表す
// 例えば、常に例外を発生させる関数などで決して値が返されることのない戻り値の型をneverとして定義できる
// エラーが常に返るような関数で消して値が正常に返らない場合にnever型を指定する
function error (message: string): never {
  throw new Error(message)
}

function foo(x: string | number | number[]): boolean {
  if(typeof x === 'string') {
    return true
  }else if (typeof x === 'number'){
    return false
  }
  // neverを利用することで明示的に値が返らないことをコンパイラに伝えることができる
  // neverを使用しないとTypeScriptはコンパイルエラーになる
  return error('Never happens')
}

// if文やswitch文でTypeScriptの型の条件分岐に漏れがないことを保証するようなケースがある
// 関数内switch文でそれぞれのEnum型のチェックをおこなった際に明示的にnever型を使用することで、将来PageTypeが新しく追加された際にswitch文の実装が漏れているとコンパイルエラーを発生させることができる
// 将来的にも定数が追加される可能性のあるenum型を定義
enum PageType {
  ViewProfile,
  EditProfile,
  ChangePassword,
}

const getTitleText = (type: PageType) => {
  switch (type) {
    case PageType.ViewProfile:
      return 'Setting'
    case PageType.EditProfile:
      return 'Edit Profile'
    case PageType.ChangePassword:
      return 'Change Password'
    default:
      // 決して起きないことをコンパイラに伝えるnever型に代入を行う
      // これによって仮に将来PageTypeのenum型に定数が新規で追加された際に、コンパイル時にエラーが起きるためバグを未然に防ぐことができる
      const wrongType: never = type
      throw new Error(`${wrongType} is not in PageType`)
  }
}