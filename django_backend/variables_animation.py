from manim import *

class PythonVariables(Scene):
    def construct(self):
        # Title
        title = Text("Understanding Python Variables", font_size=48).to_edge(UP)
        self.play(Write(title))
        self.wait(2)

        # Scene 1: Variables as Labels
        explanation1 = Text("Think of variables as labels for jars!", font_size=36).shift(UP)
        jar = SVGMobject("jar.svg").scale(0.5)  # Replace with a path to a jar SVG
        label = Text("x", font_size=24).next_to(jar, DOWN)
        self.play(Write(explanation1), FadeIn(jar), Write(label))
        self.wait(3)
        self.play(FadeOut(explanation1))

        # Scene 2: Assigning Values
        explanation2 = Text("You can assign a value to the jar.", font_size=36).shift(UP)
        value = Text("10", font_size=36).set_color(YELLOW).move_to(jar.get_center())
        self.play(Write(explanation2))
        self.play(Write(value))
        self.wait(3)
        self.play(FadeOut(explanation2))

        # Scene 3: Changing Values
        explanation3 = Text("And you can change it anytime!", font_size=36).shift(UP)
        new_value = Text("'Hello'", font_size=36).set_color(GREEN).move_to(jar.get_center())
        self.play(Write(explanation3))
        self.play(Transform(value, new_value))
        self.wait(3)
        self.play(FadeOut(explanation3))

        # Scene 4: Shared References
        explanation4 = Text("Variables can share the same value.", font_size=36).shift(UP)
        jar2 = jar.copy().shift(RIGHT * 2)
        label2 = Text("y", font_size=24).next_to(jar2, DOWN)
        shared_value = Text("10", font_size=36).set_color(YELLOW).move_to(jar2.get_center())
        self.play(Write(explanation4), FadeIn(jar2), Write(label2), Transform(new_value, shared_value))
        self.wait(3)

        # Scene 5: Memory Optimization
        explanation5 = Text("Python optimizes memory by reusing objects.", font_size=36).shift(UP)
        memory_arrow = Arrow(jar.get_center(), jar2.get_center(), buff=0.1, color=BLUE)
        self.play(FadeOut(explanation4), Write(explanation5), GrowArrow(memory_arrow))
        self.wait(3)

        # Conclusion
        conclusion = Text("That's how Python variables work!", font_size=36).shift(DOWN)
        self.play(FadeOut(explanation5), Write(conclusion))
        self.wait(3)

# To render the animation, run the following command in your terminal:
# manim -pql script_name.py PythonVariables
