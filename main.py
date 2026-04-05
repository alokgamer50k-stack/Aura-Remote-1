from kivy.app import App
from kivy.uix.button import Button
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.gridlayout import GridLayout
from kivy.core.window import Window
from kivy.graphics import Color, Ellipse, Line
from kivy.clock import Clock

class StealthCircle(Button):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.background_color = (0, 0, 0, 0)
        self.opacity = 1
        with self.canvas.before:
            # Black Premium Texture
            Color(0, 0, 0, 0.9) 
            self.shape = Ellipse(pos=self.pos, size=self.size)
            # Silver Border for High Texture look
            Color(0.6, 0.6, 0.6, 0.4)
            self.line = Line(ellipse=(self.x, self.y, self.width, self.height), width=1.5)
        self.bind(pos=self.update_canvas, size=self.update_canvas)

    def update_canvas(self, *args):
        self.canvas.before.clear()
        with self.canvas.before:
            Color(0, 0, 0, 0.9)
            Ellipse(pos=self.pos, size=self.size)
            Color(0.6, 0.6, 0.6, 0.4)
            Line(ellipse=(self.x, self.y, self.width, self.height), width=1.5)

class AuraStealthRemote(App):
    def build(self):
        self.root = FloatLayout()
        # 1. Main Stealth Circle
        self.main_btn = StealthCircle(size_hint=(None, None), size=(80, 80), pos=(20, Window.height/2))
        self.main_btn.bind(on_touch_down=self.handle_touch)
        
        # 2. Modern Menu
        self.menu = GridLayout(cols=3, size_hint=(None, None), size=(240, 240), opacity=0, spacing=10)
        icons = ['🔊', '🏠', 'Apps', '🔉', '🔇', '⚡']
        for icon in icons:
            btn = Button(text=icon, background_color=(0, 0, 0, 0.8), font_size='22sp')
            self.menu.add_widget(btn)
            
        self.root.add_widget(self.main_btn)
        self.root.add_widget(self.menu)
        
        # 10 Sec Auto-Hide timer
        self.auto_hide_job = Clock.schedule_once(self.hide_circle, 10)
        return self.root

    def hide_circle(self, dt):
        self.main_btn.opacity = 0.15 # Halka dikhega par transparent ho jayega
        self.menu.opacity = 0

    def wake_up(self):
        Clock.unschedule(self.auto_hide_job)
        self.main_btn.opacity = 1
        self.auto_hide_job = Clock.schedule_once(self.hide_circle, 10)

    def handle_touch(self, instance, touch):
        if instance.collide_point(*touch.pos):
            if touch.is_double_tap:
                self.wake_up() # Double tap se wapas dark hoga
                return True
            else:
                self.wake_up()
                self.menu.opacity = 1 if self.menu.opacity == 0 else 0
                self.menu.pos = (self.main_btn.right + 20, self.main_btn.y - 80)
                return True

if __name__ == "__main__":
    AuraStealthRemote().run()
