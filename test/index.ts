import { strictEqual } from 'assert';
import { IpMatcher } from '../src/index';

describe('IpMatcher', () => {
    it('should match correctly 1', () => {
        const matcher = new IpMatcher();

        matcher.addIpRange('103.147.197.150/8');

        strictEqual(matcher.has('103.0.0.1'), true);
        strictEqual(matcher.has('103.255.255.254'), true);
        strictEqual(matcher.has('102.255.255.254'), false);
    });

    it('should match correctly 2', () => {
        const matcher = new IpMatcher();

        matcher.addIpRange('103.147.197.150/31');
        matcher.addIp('123.33.44.56');

        strictEqual(matcher.has('103.147.197.150'), true);
        strictEqual(matcher.has('103.147.197.151'), true);
        strictEqual(matcher.has('103.147.197.152'), false);
        strictEqual(matcher.has('102.255.255.254'), false);
        strictEqual(matcher.has('123.33.44.56'), true);
        strictEqual(matcher.has('123.33.44.57'), false);
        strictEqual(matcher.has('123.33.44.58'), false);
    });

    it('should match aws', () => {
        const matcher = new IpMatcher();
        const json = require('./aws-ip-ranges.json');
        const ranges = json.prefixes.map((prefix) => prefix.ip_prefix);
        for (const range of ranges) {
            matcher.addIpRange(range);
        }

        strictEqual(matcher.has('54.191.213.171'), true);
        strictEqual(matcher.has('52.27.185.222'), true);
        strictEqual(matcher.has('34.218.109.45'), true);
        strictEqual(matcher.has('34.214.217.236'), true);
        strictEqual(matcher.has('34.218.125.234'), true);
        strictEqual(matcher.has('34.214.217.236'), true);
        strictEqual(matcher.has('103.147.197.151'), false);
        strictEqual(matcher.has('103.147.197.152'), false);
        strictEqual(matcher.has('102.255.255.254'), false);
    });
});
