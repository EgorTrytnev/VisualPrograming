import { describe, expect, it } from "vitest";
import { expectType } from "../src/expect-type.js";
import type { DeepReadonly, EventHandlers, PickedByType } from "../src/types.js";

describe("utility types", () => {
  it("DeepReadonly makes nested properties readonly", () => {
    type User = {
      id: number;
      profile: {
        name: string;
        isActive: boolean;
      };
    };

    type ReadonlyUser = DeepReadonly<User>;
    type Expected = {
      readonly id: number;
      readonly profile: {
        readonly name: string;
        readonly isActive: boolean;
      };
    };

    const user: ReadonlyUser = {
      id: 1,
      profile: {
        name: "Egor",
        isActive: true
      }
    };
    const expectedUser: Expected = user;

    expectType<Expected>(user);
    expectType<ReadonlyUser>(expectedUser);

    expect(user.profile.name).toBe("Egor");
  });

  it("PickedByType keeps only properties assignable to the selected type", () => {
    type Mixed = {
      id: number;
      title: string;
      subtitle: string;
      isPublished: boolean;
    };

    type StringOnly = PickedByType<Mixed, string>;
    type Expected = {
      title: string;
      subtitle: string;
    };

    const value: StringOnly = {
      title: "TS",
      subtitle: "utility types"
    };
    const expectedValue: Expected = value;

    expectType<Expected>(value);
    expectType<StringOnly>(expectedValue);

    expect(value.title).toBe("TS");
  });

  it("EventHandlers generates on<EventName> callbacks", () => {
    type Events = {
      click: { x: number; y: number };
      submit: { formId: string };
    };

    type Handlers = EventHandlers<Events>;
    type Expected = {
      onClick: (event: { x: number; y: number }) => void;
      onSubmit: (event: { formId: string }) => void;
    };

    const handlers: Handlers = {
      onClick: (event: { x: number; y: number }) => {
        expect(event.x).toBe(10);
      },
      onSubmit: (event: { formId: string }) => {
        expect(event.formId).toBe("login-form");
      }
    };
    const expectedHandlers: Expected = handlers;

    expectType<Expected>(handlers);
    expectType<Handlers>(expectedHandlers);

    handlers.onClick({ x: 10, y: 20 });
    handlers.onSubmit({ formId: "login-form" });
  });
});
