export class Vec2 {
    public x: number;
    public y: number;

    private constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /* Static methods */
    public static new() {
        return new Vec2(0, 0);
    }

    public static from_xy(x: number, y: number) {
        return new Vec2(x, y);
    }

    /* Instance methods */
    public extended(z: number) {
        return Vec3.from_xyz(this.x, this.y, z);
    }

    public add(vec: Vec2) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    public sub(vec: Vec2) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    public mul(vec: Vec2) {
        this.x *= vec.x;
        this.y *= vec.y;
        return this;
    }

    public div(vec: Vec2) {
        this.x /= vec.x;
        this.y /= vec.y;
        return this;
    }

    public scale(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    public length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public normalize() {
        const len = this.length();
        this.x /= len;
        this.y /= len;
        return this;
    }

    public dot(vec: Vec2) {
        return this.x * vec.x + this.y * vec.y;
    }

    public projected(vec: Vec2) {
        const dot = this.dot(vec);
        return vec.scale(dot / vec.length());
    }

    public angle(vec: Vec2) {
        return Math.acos(this.dot(vec) / (this.length() * vec.length()));
    }

    public cloned() {
        return new Vec2(this.x, this.y);
    }

    public copy(vec: Vec2) {
        this.x = vec.x;
        this.y = vec.y;
        return this;
    }
}

export class Vec3 {
    public x: number;
    public y: number;
    public z: number;

    private constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /* Static methods */
    public static new() {
        return new Vec3(0, 0, 0);
    }

    public static from_xyz(x: number, y: number, z: number) {
        return new Vec3(x, y, z);
    }

    public static from_vec2(vec2: Vec2, z: number) {
        return new Vec3(vec2.x, vec2.y, z);
    }

    /* Instance methods */
    public add(vec: Vec3) {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
        return this;
    }

    public sub(vec: Vec3) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
        return this;
    }

    public mul(vec: Vec3) {
        this.x *= vec.x;
        this.y *= vec.y;
        this.z *= vec.z;
        return this;
    }

    public div(vec: Vec3) {
        this.x /= vec.x;
        this.y /= vec.y;
        this.z /= vec.z;
        return this;
    }

    public scale(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    public length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public normalize() {
        const len = this.length();
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    }

    public dot(vec: Vec3) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    public crossed(vec: Vec3) {
        return new Vec3(
            this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x
        )
    }

    public projected(vec: Vec3) {
        const dot = this.dot(vec);
        return vec.scale(dot / vec.length());
    }

    public angle(vec: Vec3) {
        return Math.acos(this.dot(vec) / (this.length() * vec.length()));
    }

    public cloned() {
        return new Vec3(this.x, this.y, this.z);
    }

    public copy(vec: Vec3) {
        this.x = vec.x;
    }
}