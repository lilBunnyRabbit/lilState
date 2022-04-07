{
  class TestError extends Error {
    constructor(name, message) {
      super(message);
      this.name = `❌ TEST "${name}"`;
      this.message = message;
    }
  }
  
  function formatCode(code) {
    const match = code.match(new RegExp("{(.|\\n)*}", "g"));
    if (match.length === 0) return "";
    let lines = match[0].split("\n");
    if (lines.length < 3) return "";
    lines = lines.splice(1, lines.length - 2);
  
    const minSpaces = lines.reduce((prev, current) => {
      if (current.trim().length === 0) return prev;
      const spaces = getSpaces(current);
      if (prev === null || spaces < prev) return spaces;
      return prev;
    }, null) || 0;
  
    return lines.map((val) => {
      if (val.length <= minSpaces) return val;
      return val.substring(minSpaces, val.length);
    }).join("\n");
  
    function getSpaces(val) {
      for (let i = 0; i < val.length; i++) if (val[i] !== " ") return i;
      return 0;
    };
  }

  const generateAssert = (name) => ({
    defined: function (actual, variableName) {
      if (actual === undefined) {
        throw new TestError(name, `${variableName || "Value"} is not defined`);
      }
    },
    equal: function (actual, expected, variableName) {
      if (actual !== expected) {
        throw new TestError(
          name,
          `Expected "${expected}" but got "${actual}"${variableName ? ` for ${variableName}` : ""}`
        );
      }
    },
    truthy: function (actual, variableName) {
      if (!!actual !== true) {
        throw new TestError(name, `Expected "${actual}" to be truthy${variableName ? ` for ${variableName}` : ""}`);
      }
    },
    falsy: function (actual, variableName) {
      if (!actual !== false) {
        throw new TestError(name, `Expected "${actual}" to be falsy${variableName ? ` for ${variableName}` : ""}`);
      }
    },
    contains: function (actual, key) {
      if (Array.isArray(actual)) {
        if (!actual.includes(key)) {
          throw new TestError(name, `Expected array to contain "${key}"`);
        }
      } else {
        if (!actual.hasOwnProperty(key)) {
          throw new TestError(name, `Expected object to contain key "${key}"`);
        }
      }
    },
    timeout: function (message, callback, time = 500) {
      setTimeout(() => callback(new TestError(name, message)), time);
    },
  });

  async function executeTest(name, callback) {
    try {
      await Promise.resolve(callback(generateAssert(name)));
      return false;
    } catch (error) {
      return error.message || "Unknown error";
    }
  }

  async function genTests(callback) {
    const parent = document.createElement("div");
    parent.className = "tests";

    const tests = [];
  
    await Promise.resolve(callback((name, cb) => tests.push({ name, callback: cb })));
  
    const testElements = await Promise.all(
      tests.map(async ({ name, callback: cb }, i) => {
        return new Promise(async (resolve) => {
          const testFailed = await executeTest(name, cb);

          const codeString = formatCode(cb.toString());

          const element = document.createElement("div");
          element.className = `test ${testFailed ? "failed" : ""}`;

          const title = document.createElement("div");
          title.className = "title";
          title.innerText = `${i + 1}. ${name}`;

          const body = document.createElement("div");
          body.className = "body collapsed";
          body.innerHTML = `
          ${testFailed ? `<div>${testFailed}</div>` : ""}
          <pre><code>${window.hljs ? hljs.highlight(codeString, { language: "javascript" }).value : codeString}</code></pre>
          `;
  
          element.appendChild(title);
          element.appendChild(body);

          title.onclick = () => body.classList.toggle("collapsed");

          resolve(element);
        });
      })
    );
  
    testElements.forEach((e) => parent.appendChild(e));

    document.currentScript.parentElement.replaceChild(parent, document.currentScript);
  }

  window.genTests = genTests;
}

