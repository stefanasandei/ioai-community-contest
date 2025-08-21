const RulesSection = () => {
  return (
    <section id="rules">
      <div className="max-w-7xl pt-10 mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6 font-display">
            Contest Rules
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Simple, fair guidelines to ensure everyone has the best experience possible
          </p>
        </div>

        {/* Detailed Rules Text */}
        <div className="my-16 max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-elegant">
            <h3 className="text-2xl font-bold text-foreground mb-6">Detailed Contest Guidelines</h3>
            <div className="prose prose-gray max-w-none text-muted-foreground space-y-4">
              <h4 className="text-xl font-semibold text-foreground">Rules</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Use of LLMs for writing code or getting task ideas is <strong>forbidden</strong> (because we can't control what LLM they use; like in the actual IOAI, they allow 4o-mini, which is dumb enough to not solve the whole task).
                </li>
                <li>
                  Use of the internet is <strong>forbidden</strong> except for reading official library documentation and accessing the contest platform.
                </li>
                <li>
                  Communicating with anyone during the contest is <strong>forbidden</strong>.
                </li>
                <li>
                  Only ask questions regarding task statements using the official methods we provide (e.g., our Discord channel for clarifications).
                </li>
              </ul>
              <p>
                <strong>Note:</strong> We can't enforce these rules, but following them ensures fair play and a more accurate simulation of the IOAI. It is in the best interest of all contestants to follow the rules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;