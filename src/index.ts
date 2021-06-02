class Node {
    public children: [Node | null, Node | null] = [null, null];
    public marked: boolean = false;
    constructor() {}

    append(key: 0 | 1): Node {
        if (!this.children[key]) {
            this.children[key] = new Node();
        }
        return this.children[key]!;
    }
}

function toIpBits(ip: string) {
    const nums = ip.split('.').map((num) => parseInt(num));
    return nums.reduce((prev, cur) => (prev << 8) + cur, 0);
}

function getBit(bits: number, position: number): 0 | 1 {
    return ((bits >> (31 - position)) & 1) as 0 | 1;
}

export class IpMatcher {
    private root: Node;
    constructor() {
        this.root = new Node();
    }

    addIpRange(ipRange: string) {
        if (!ipRange.match(/\d+\.\d+\.\d+\.\d+\/\d+/)) {
            throw new Error(
                'Invalid ip range format. Example: "192.168.1.10/24"'
            );
        }
        const [ip, subnetMask] = ipRange.split('/');
        const bits = toIpBits(ip);
        const subnetNum = parseInt(subnetMask);
        let node: Node = this.root;
        for (let i = 0; i < subnetNum; i++) {
            node = node.append(getBit(bits, i));
            if (node.marked) return;
        }
        node.marked = true;
    }

    addIp(ip: string) {
        this.addIpRange(`${ip}/32`);
    }

    has(ip: string): boolean {
        const bits = toIpBits(ip);
        let node: Node | null = this.root;
        for (let i = 0; i < 32; i++) {
            node = node.children[getBit(bits, i)];
            if (!node) return false;
            if (node.marked) return true;
        }
        return false;
    }
}
