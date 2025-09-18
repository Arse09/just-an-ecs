/**
 * @author Arse09
 * @license MIT (LICENSE)
 */

import { describe, it, expect } from 'vitest';
import { ECS } from '../src/index';
import { TestPositionC, TestVelocityC, TestEmptyC, TestTickR, TestTickUpdaterS, TestMovementS } from './Test';

describe('ECS Core Functionality', () => {
    it('queries should find the correct entities', () => {
        const ecs = new ECS();
        // Create two entities with TestPositionC
        const e1 = ecs.newEntity(
            { class: TestPositionC, args: { x: 5, y: 10 } },
            { class: TestVelocityC, args: { vx: 2, vy: 3 } },
            { class: TestEmptyC }
        );
        const e2 = ecs.newEntity(
            { class: TestPositionC, args: { x: 7, y: 14 } },
            { class: TestEmptyC } // this one has no velocity
        );
        // Query entities that have TestPositionC (and optionally others)
        const queryPosAll = ecs.query(TestPositionC);
        // Expect both entities in the result (order may vary)
        expect(queryPosAll.entities).toContain(e1);
        expect(queryPosAll.entities).toContain(e2);
        expect(queryPosAll.entities).toHaveLength(2);

        // Query entities that have both TestPositionC and TestVelocityC
        const queryPosVel = ecs.query(TestPositionC, TestVelocityC);
        // Only e1 has both components
        expect(queryPosVel.entities).toContain(e1);
        expect(queryPosVel.entities).not.toContain(e2);
        expect(queryPosVel.entities).toHaveLength(1);

        // Query with TestEmptyC tag as filter
        const queryEmpty = ecs.query(TestEmptyC);
        expect(queryEmpty.entities).toEqual(expect.arrayContaining([e1, e2]));
        expect(queryEmpty.entities).toHaveLength(2);
    });

    it('should allow writing and reading component data', () => {
        const ecs = new ECS();
        const e = ecs.newEntity(
            { class: TestPositionC, args: { x: 1, y: 2 } },
            { class: TestVelocityC, args: { vx: 3, vy: 4 } }
        );
        // Read initial values
        const pos1 = e.read(TestPositionC, true);
        const vel1 = e.read(TestVelocityC, true);
        expect(pos1.x).toBe(1);
        expect(pos1.y).toBe(2);
        expect(vel1.vx).toBe(3);
        expect(vel1.vy).toBe(4);

        // Write new values
        const posWrite = e.write(TestPositionC, true);
        posWrite.x = 42;
        posWrite.y = -5;
        const velWrite = e.write(TestVelocityC, true);
        velWrite.vx = 10;
        velWrite.vy = -10;

        // Read again to verify updates
        const pos2 = e.read(TestPositionC, true);
        const vel2 = e.read(TestVelocityC, true);
        expect(pos2.x).toBe(42);
        expect(pos2.y).toBe(-5);
        expect(vel2.vx).toBe(10);
        expect(vel2.vy).toBe(-10);
    });

    it('systems should update Tick resource and entity positions correctly', async () => {
        const ecs = new ECS();
        // Register systems and resources as in the library example
        ecs.registerSys(TestTickUpdaterS, TestMovementS);
        ecs.registerRes(
            { class: TestTickR, args: { elapsedSec: 0, deltaSec: 0, lastSec: performance.now() / 1000 } }
        );
        // Create an entity at (0,0) with velocity (1,1)
        const e = ecs.newEntity(
            { class: TestPositionC, args: { x: 0, y: 0 } },
            { class: TestVelocityC, args: { vx: 1, vy: 1 } },
            { class: TestEmptyC }
        );
        // Capture initial tick and position
        const resQuery = ecs.queryRes(TestTickR);
        const tick0 = resQuery.read(TestTickR, true);
        const pos0 = e.read(TestPositionC, true);
        expect(tick0.elapsedSec).toBe(0);
        expect(tick0.deltaSec).toBe(0);
        expect(pos0.x).toBe(0);
        expect(pos0.y).toBe(0);

        // Perform an update (this runs TestTickUpdaterS then TestMovementS)
        ecs.update();

        // After update, tick.deltaSec should be >= 0 and elapsedSec should have increased
        const tick1 = resQuery.read(TestTickR, true);
        expect(tick1.deltaSec).toBeGreaterThanOrEqual(0);
        expect(tick1.elapsedSec).toBeGreaterThanOrEqual(0);

        // Also, entity position should have moved by (vx * deltaSec, vy * deltaSec)
        const pos1 = e.read(TestPositionC, true);
        // Since velocity is 1, pos should simply be deltaSec (with small floating margin).
        expect(pos1.x).toBeGreaterThanOrEqual(0);
        expect(pos1.y).toBeGreaterThanOrEqual(0);
        // Ensure some movement occurred (deltaSec should cause a positive movement)
        expect(pos1.x + pos1.y).toBeGreaterThan(0);

        // Run a second update to ensure continuity: positions should keep increasing
        ecs.update();
        const pos2 = e.read(TestPositionC, true);
        expect(pos2.x).toBeGreaterThanOrEqual(pos1.x);
        expect(pos2.y).toBeGreaterThanOrEqual(pos1.y);
    });

    it('should allow registering and unregistering systems', () => {
        const ecs = new ECS();
        expect(ecs.isSysRegistered(TestMovementS)).toBe(false);
        ecs.registerSys(TestMovementS);
        expect(ecs.isSysRegistered(TestMovementS)).toBe(true);
        ecs.unregisterSys(TestMovementS);
        // System should be unregistered after an update call
        ecs.update();
        expect(ecs.isSysRegistered(TestMovementS)).toBe(false);
    });

    it('should delete entities correctly', () => {
        const ecs = new ECS();
        // Create an entity with a position component
        const e = ecs.newEntity({ class: TestPositionC, args: { x: 100, y: 200 } });
        // Ensure it is found by a query
        expect(ecs.query(TestPositionC).entities).toContain(e);
        // Delete the entity and process deletion
        ecs.deleteEntity(e);
        ecs.update(); // deferred deletion happens after update
        // Now the entity should no longer be returned by queries
        expect(ecs.query(TestPositionC).entities).not.toContain(e);
        expect(ecs.query(TestPositionC).entities).toHaveLength(0);
    });
});
