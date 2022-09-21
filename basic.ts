/*
  2.3.1 / 型推論
*/
const age = 10
console.log(age.length) // エラー: ageはnumber型なのでlengthプロパティはない

const user = {
  name: 'Takuya',
  age: 36
}
console.log(user.age.length)  // エラー: ageはnumber型なのでlengthプロパティはない

// 関数の戻り値も同様
function getUser() {
  return {
    name: 'Takuya',
    age: 36
  }
}
const user1 = getUser()
console.log(user1.age.length) // エラー: ageはnumber型なのでlengthプロパティはない

// 配列の型推論
const names = ['Takuya', 'Yoshiki', 'Taketo']
names.forEach((name) => {
  // nameはstring型として扱われるので下記のように関数名を間違えるとエラーになる。 → toUpperCase()
  console.log(name.toUppercase())
})

// 代入先の変数の値が決まっている場合
// window.confirm関数の返り値はbooleanを返すことをTypeScriptは知っているため代入する関数の型が一致しない場合エラーになる
window.confirm = () => {
  console.log('confirm関数')
}

/*
  2.3.2 / 型アサーション
*/
/*
  document.getElementById() ... TypeScriptはHTMLElement（もしくはnull）が返ってくるということしかわからない。
  HTMLElementでもそれがdivなのかcanvasなのかでできる操作は異なる。
  TypeScript上ではdocument.getElementById()で取得できるものの型を感知できないので、divだったら、canvasだったらと自動で判定して処理はしてくれない
*/
// JavaScriptではエラーにならないがTypeScriptではコンパイルエラーになる↓
const myCanvas = document.getElementById('main_canvas')
console.log(myCanvas.width) // document.getElementById()が返すのはHTMLElementでHTMLCanvasElementではないので型が合わないというエラー
// 開発者が対象のIDを持つノードがHTMLCanvasElementだとわかっている場合には明示的に型を指定することができる。
const myCanvas1 = document.getElementById('main_canvas') as HTMLCanvasElement
console.log(myCanvas1.width)

// 2段階アサーション
// const result = (response as any) as User
const hoge: any = 'test'
const fuga: number = hoge as number // コンパイル時にはnumber型として扱ってエラーが起きないが、実行時にはstringが渡されるためエラーが起きる

/*
  2.3.3 / 型エイリアス
*/
// 型の指定の別名（エイリアス）を設ける機能 大文字始まりにすることが一般的
// type Name = string

type Point = {
  x: number
  y: number
}

function printPoint(point: Point) {
  console.log(`x座標は${point.x}です`)
  console.log(`y座標は${point.y}です`)
}

printPoint({ x: 100, y: 100 })
printPoint({ z: 100, t: 100 })  // 型があっていてもプロパティ名が異なるとエラー

// 関数の型も型エイリアスで定義
type Formatter = (a: string) => string

function printName(firstName: string, formatter: Formatter) {
  console.log(formatter(firstName))
}

// オブジェクトのキー名を明記せずに型エイリアスを定義（インデックス型）
// キー名やキー数が事前に定まらないケースのオブジェクトを定義するときなどに便利
type Label = {
  [key: string] : string
}

const labels: Label = {
  topTitle: 'トップページのタイトルです',
  topSubTitle: 'トップページのサブタイトルです',
  topFeature1: 'トップページの機能1です',
  topFeature2: 'トップページの機能2です',
}

// 値部分の型が合わないためエラー
const hoge: Label = {
  message: 100
}

/*
  2.3.4 / インターフェイス
*/
interface Point1 {
  x: number
  y: number
}

function printPointer(point: Point1) {
  console.log(`x座標は${point.x}です`)
  console.log(`y座標は${point.y}です`)
  console.log(`z座標は${point.z}です`)
}

// Point1にzを追加
interface Point1 {
  z: number
}

printPointer({ x: 100, y: 100 })          // 引数のオブジェクトにzが存在しないためエラー
printPointer({ x: 100, y: 100, z: 100})   // 問題なく動作
// 型エイリアスは後から同名での型定義はできないが、インターフェイスは拡張可能

//インターフェイスはクラスの振る舞いの型を定義し、implementsを使用してクラスに実装を与えること（委譲）が可能
interface Point2 {
  x: number
  y: number
  z: number
}

// MyPointクラスがPoint2インターフェイスをimplementsした際に、zが存在しないためエラー
class MyPoint implements Point2 {
  x: number
  y: number
}

// インターフェイスのオプショナルなプロパティ
interface Point3 {
  x: number
  y: number
  z?: number
}
// エラーは発生しない
class MyPoint1 implements Point3 {
  x: number
  y: number
}

// extendsを使った他のインターフェイスの拡張
interface Colorful {
  color: string
}
interface Circle {
  radius: number
}
// 複数のインターフェイスを継承して新たなインターフェイスを定義
interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: '赤',
  radius: 10
}

/*
  オブジェクトの型を定義する際にインターフェイスと型エイリアスどちらも利用が可能で、継承に関する細かな機能の違いはあるもののほぼ同等の機能を持つ
  ただし、TypeScriptの設計思想としてこの2つの機能は少し異なる点がある
  インターフェイスはクラスやデータの一側面を定義した型、つまり、インターフェイスにマッチする型でもその値意外に他のフィールドやメソッドがある前提でのもの。
  型エイリアスはオブジェクトの型そのものを表す。
  オブジェクトそのものではなく、「クラス」や「オブジェクトの一部のプロパティ」や「関数」含む一部の『振る舞い』を定義するものであれば、インターフェイスを利用するのが適している。
*/

/*
  2.3.5 / クラス
*/
class PointClass {
  x: number
  y: number

  // 引数がない場合の初期値を指定
  constructor(x: number = 0, y: number = 0) {
    this.x = x
    this.y = y
  }

  moveX(n: number): void {
    this.x += n
  }

  moveY(n: number): void {
    this.y += n
  }
}

const po = new PointClass()
po.moveX(10)
console.log(`${po.x}, ${po.y}`) // 10, 0

// PointClassクラスを継承
class Point3D extends PointClass {
  z: number

  constructor(x: number = 0, y: number = 0, z: number = 0){
    super(x, y) // 継承元のコンストラクタを呼び出す
    this.z = z
  }

  moveZ(n: number): void {
    this.z += n
  }
}

const point3D = new Point3D()
point3D.moveX(10)
point3D.moveZ(20)
console.log(`${point3D.x}, ${point3D.y}, ${point3D.z}`) // 10, 0, 20

// インターフェイスに対してimplementsを利用することで、クラスに対する実装の強制が可能
// Userという、IUserインターフェイスを実装するクラスの例
interface IUser {
  name: string
  age: number
  sayHello: () => string  // 引数なしで文字列を返す
}

class User implements IUser {
  name: string
  age: number

  constructor(){
    this.name = ''
    this.age = 0
  }

  sayHello(): string {
    return `こんにちは、私は${this.name}, ${this.age}歳です。`
  }
}

const iuser = new User()
iuser.name = 'Takuya'
iuser.age = 36
console.log(iuser.sayHello()) // こんにちは、私はTakuya, 36歳です。

// アクセス修飾子
class BasePoint3D {
  public x: number
  private y: number
  protected z: number
}
// インスタンス化をおこなった場合のアクセス制御の例
const basePoint = new BasePoint3D()
basePoint.x // アクセス可
basePoint.y // アクセス不可
basePoint.z // アクセス不可
// クラスを継承した際のアクセス制御の例
class ChildPoint extends BasePoint3D {
  constructor(){
    super()
    this.x // アクセス可
    this.y // アクセス不可
    this.z // アクセス可
  }
}